const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
    storeUserOnDB,
    logInCheck,
    getProfileInfoOfLoggedInUser,
    addImageToDatabase,
    checkForValidEmail,
    storePasswordCode,
    compareCodes,
    storeBioOnDb,
    updatingPassword,
    searchUsersInput,
    getUserById,
    recentlyAddedUsers,
} = require("../database/db");
const { upload } = require("../s3");
const cryptoRandomString = require("crypto-random-string");

// ---- > Multer Setup < ---- //
const uidSafe = require("uid-safe");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log("destitnation");
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            console.log("filename");
            callback(null, `${randomId}${path.extname(file.originalname)}`);
        });
    },
});
const uploader = multer({
    storage,
});

// ---- > Function to hash the password < ---- //
function hashPassword(password) {
    return bcrypt.genSalt().then((salt) => {
        return bcrypt.hash(password, salt);
    });
}

// ---- > Middleware <---- //
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    cookieSession({
        sameSite: true,
        secret: "Bananas",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// ---- > Server Routes < ----//
app.get("/user/id.json", (req, res) => {
    res.json(req.session);
});

// ---- > Login Route < ---- //
app.post("/login", async (req, res) => {
    try {
        const user = await logInCheck(req.body);
        if (user) {
            req.session.user_id = user.id;
            req.session.recent_id = user.id;
            res.json({ success: true });
        } else {
            res.json({ success: false });
            console.log("error on check for login credentials -> ");
        }
    } catch (error) {
        res.json({ success: false });
        console.log("error on check for login credentials -> ", error);
    }
});

// ---- > Register Route < ---- //
app.post("/register", async (req, res) => {
    console.log("register", req.body);
    const { password } = req.body;
    // ---- > hashing users PW after sent to server, then adding new property to req.body with value of hashed PW < ---- //
    try {
        const hashedPassword = await hashPassword(password);
        req.body.hashed_password = hashedPassword;
        try {
            const result = await storeUserOnDB(req.body);
            console.log("succesfully added user to db", result);
            req.session.user_id = result.id;
            req.session.recent_id = result.id;
            res.json({ success: true });
        } catch (error) {
            console.log("error on adding Userinfo to DB -> ", error);
            res.json({ success: false });
        }
    } catch (error) {
        console.log("error on hashing password ->", error);
    }
});

// ---- > Upload Profile Picture Route < ---- //
app.post(
    "/user/uploadImage",
    uploader.single("image"),
    upload,
    async (req, res) => {
        const imgUrl = req.body.imgUrl;
        const user_id = req.session.user_id;
        const result = await addImageToDatabase(imgUrl, user_id);
        console.log("server result --->>", result.rows[0]);
        res.json(result.rows[0]);
    }
);

// ---- > Userinformation Route after Login/Register on App < ---- //
app.get("/api/users/me", async (req, res) => {
    try {
        const user = await getProfileInfoOfLoggedInUser(req.session.user_id);
        res.json(user);
    } catch (err) {
        console.log("error at getting users profile info -> ", err);
    }
});

// ---- > Route for resetting Password < ---- //
app.post("/reset-password", async (req, res) => {
    console.log("req.body ->", req.body);
    if (req.body.currentStep === 1) {
        try {
            const validEmail = await checkForValidEmail(req.body);
            if (validEmail) {
                const secretCode = cryptoRandomString({
                    length: 4,
                });
                const storedCode = await storePasswordCode(
                    secretCode,
                    req.body.email
                );
                console.log("Result from storing code on DB ->", storedCode);
                res.json({ successStepOne: true });
            } else {
                console.log("no valid email entered");
                res.json({ successStepOne: false });
            }
        } catch (err) {
            console.log("error storing password code on DB -> ", err);
            res.json({ successStepOne: false });
        }
    } else if (req.body.currentStep === 2) {
        try {
            console.log("on step two", req.body);
            const result = await compareCodes(req.body);
            if (result) {
                console.log("result from comparing ->", result);
                try {
                    const hashed_password = await hashPassword(
                        req.body.new_password
                    );
                    try {
                        const resultStoringNewPw = await updatingPassword(
                            hashed_password,
                            req.session.user_id
                        );
                        console.log(
                            "Result from storing new PW on DB -> ",
                            resultStoringNewPw
                        );
                        res.json({ successStepTwo: true });
                    } catch (error) {
                        console.log("error updatuing password", error);
                    }
                } catch (error) {
                    console.log("error on hashing password");
                    res.json({ successStepTwo: false });
                }
            } else {
                console.log("no good result step 2");
                res.json({ successStepTwo: false });
            }
        } catch (err) {
            console.log("error at comparing codes ->", err);
            res.json({ successStepTwo: false });
        }
    }
});

// ---- > Route to store Bio on Database < ---- //
app.post("/user/bio", async (req, res) => {
    console.log(req.body);
    try {
        const result = await storeBioOnDb(req.body.bio, req.session.user_id);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log("error at adding bio to DB ->", error);
    }
});

// ----> Route to fetch the users in search from < ---- //
app.get("/api/find-people", async (req, res) => {
    try {
        if (req.query.search.length > 0) {
            const result = await searchUsersInput(
                req.query.search,
                req.session.user_id
            );
            console.log("result from search->", result);
            if (result !== null) res.json(result);
        } else {
            const result = await recentlyAddedUsers(req.session.user_id);
            res.json(result);
        }
    } catch (error) {
        console.log(error);
    }
});

// ----> Route for individual user profile < ---- //
app.get("/api/otherUser/:user_id", async (req, res) => {
    try {
        console.log("reg id", req.session.user_id);
        console.log("Fetch to api user works", req.params.user_id);
        if (req.session.user_id === +req.params.user_id) {
            console.log("own user");
            res.json({ error: "ownUser" });
            return;
        }
        const result = await getUserById(req.params.user_id);
        console.log("result", result);
        if (!result) {
            console.log("undefined");
            res.json({ error: "notFound" });
            return;
        }
        res.json(result);
    } catch (error) {
        console.log("Error in getting user by id -> ", error);
        res.json({ error: "notFound" });
    }
});

// --- > Recent Logins < --- //
app.get("/recentLogins", async (req, res) => {
    console.log("req.recent", req.session.recent_id);
    if (!req.session.recent_id) {
        res.json({ error: "noUserFound" });
        return;
    }
    const result = await getUserById(req.session.recent_id);
    console.log("result recent -> ", result);
    if (!result) {
        res.json({ error: "noUserFound" });
        return;
    }
    res.json(result);
});

// ---- > Logout Route < ---- //
app.get("/logout", (req, res) => {
    console.log(req.session.user_id);
    req.session.user_id = null;
    console.log(req.session.user_id);
    res.json({ success: true });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening...");
});
