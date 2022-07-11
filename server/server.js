const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
    storeUserOnDB,
    storePost,
    logInCheck,
    getProfileInfoOfLoggedInUser,
    addImageToDatabase,
    checkForValidEmail,
    storePasswordCode,
    compareCodes,
    storeBioOnDb,
    updatingPassword,
    searchUsersInput,
    getPostFromFriends,
    getUserById,
    recentlyAddedUsers,
    getFriendshipStatus,
    deleteRowFromFriendships,
    addRequestToFriendships,
    acceptFriendship,
    endFriendship,
    addCoverPhoto,
    getAllFriendsAndWannabes,
    getRecentChatMessage,
    storeMessageOnDb,
    storeWallPostInDb,
    getAllPostsFromDBbyRecipientID,
    getAllFriends,
    storePrivateMessage,
    getAllPrivateMessages,
} = require("../database/db");
const { upload } = require("../s3");
const { Server } = require("http");
const cryptoRandomString = require("crypto-random-string");
const server = Server(app);

// ---- > Multer Setup < ---- //
const uidSafe = require("uid-safe");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
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
const cookieSessionMiddleware = cookieSession({
    secret: "...",
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});
app.use(cookieSessionMiddleware);

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

// ---- > check friendship status < ---- //
app.get("/friendship-status/:otherUserId", async (req, res) => {
    const otherUserId = req.params.otherUserId;
    const ownUserId = req.session.user_id;

    const result = await getFriendshipStatus(ownUserId, otherUserId);
    console.log("Friendship status: ", result);
    if (!result) {
        res.json({ error: "noRelationshipYet" });
        return;
    }
    res.json(result);
});

// ----> Route for Friedship button Action <---- //
app.post("/friendship-button", async (req, res) => {
    const { buttonLabel, otherUserId } = req.body;
    const ownUserId = req.session.user_id;
    if (buttonLabel === "Cancel Request") {
        const result = await deleteRowFromFriendships(ownUserId, otherUserId);
        console.log(result);
        res.json({ canceled: true });
        return;
    }

    if (buttonLabel === "Add Friend") {
        const result = await addRequestToFriendships(ownUserId, otherUserId);
        console.log(result);
        res.json({ added: true });
        return;
    }

    if (buttonLabel === "Accept Request") {
        const result = await acceptFriendship(ownUserId, otherUserId);
        console.log(result);
        res.json({ accepted: true });
        return;
    }

    if (buttonLabel === "End Friendship") {
        const result = await endFriendship(ownUserId, otherUserId);
        console.log(result);
        res.json({ ended: true });
        return;
    }
});

// ----> Route to check if there is recent user cookies stores < ---- //
app.get("/recent-login-available", (req, res) => {
    if (req.session.recent_id) {
        res.json({ recentUser: true });
    } else {
        res.json({ recentUser: false });
    }
});

// ---- > Route to delete recent cookies < ---- //
app.get("/delete-cookies", (req, res) => {
    try {
        req.session.recent_id = null;
        res.json({ success: true });
    } catch (error) {
        console.log("error at deleting cookies -> ", error);
    }
});

// ---- > Route to upload Cover Photo < ---- //
app.post(
    "/user/uploadCoverPhoto",
    uploader.single("cover"),
    upload,
    async (req, res) => {
        console.log("coverPhoto body->", req.body);
        const imgUrl = req.body.imgUrl;
        const user_id = req.session.user_id;
        const result = await addCoverPhoto(imgUrl, user_id);
        console.log("COVER Photo Added to DB");
        res.json(result);
    }
);

// ---- > Route for recent login < ---- //
app.get("/set-recent-login", (req, res) => {
    console.log("set login works");
    try {
        req.session.user_id = req.session.recent_id;
        res.json({ success: true });
    } catch (error) {
        console.log(error);
    }
});

// ----> Route to get all friends and wannabe friends from DB <---- //
app.get("/friends-and-wannabes", async (req, res) => {
    console.log("TRYING TO GET FRIENDS AND WANNABES");
    const result = await getAllFriendsAndWannabes(req.session.user_id);
    console.log("Result from Query -> ", result);
    res.json(result);
});

// ---- > socket setup < ---- //
const io = require("socket.io")(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});
io.use((socket, next) =>
    cookieSessionMiddleware(socket.request, socket.request.res, next)
);

let connectedUsers = {};

io.on("connection", async (socket) => {
    const { user_id } = socket.request.session;
    connectedUsers[user_id] = [...(connectedUsers[user_id] || []), socket.id];
    // get recent prvt messages and emit them
    socket.on("getAllPrivateMessages", async (friend_id) => {
        const result = await getAllPrivateMessages(user_id, friend_id);
        socket.emit("receivePrivateMessages", result);
    });
    // store new private message on DB and then send new Message to private chat
    socket.on("sendPrivateMessage", async ({ message, friend_id }) => {
        const sender = await getUserById(user_id);
        const result = await storePrivateMessage(user_id, friend_id, message);
        //
        /*  for (let i = 0; i < connectedUsers[friend_id].length; i++) {
            const currentSocketId = connectedUsers[friend_id][i];
            const friendSocket = io.sockets.sockets.get(currentSocketId);
            friendSocket.emit("newPrivateMessage", {
                first_name: sender.first_name,
                last_name: sender.last_name,
                profile_picture_url: sender.profile_picture_url,
                ...result,
            });
        } */
        socket.emit("newPrivateMessage", { ...sender, ...result });
    });

    // get recent messages and sent to client
    socket.on("getRecentMessages", async () => {
        const recentChatMessages = await getRecentChatMessage();
        socket.emit("recentMessages", recentChatMessages.reverse());
    });

    // store new message in DB and then send new message to chat
    socket.on("sendMessage", async (text) => {
        const sender = await getUserById(user_id);
        const message = await storeMessageOnDb({
            sender_id: user_id,
            text: text,
        });
        io.emit("newMessage", {
            first_name: sender.first_name,
            last_name: sender.last_name,
            profile_picture_url: sender.profile_picture_url,
            ...message,
        });
    });

    socket.on("disconnect", () => {
        connectedUsers[user_id] = [];
    });
});

app.post("/wallpost", async (req, res) => {
    const user = await getUserById(req.session.user_id);
    const result = await storeWallPostInDb(
        req.body.post,
        req.session.user_id,
        req.body.otherUserId
    );
    console.log("result after db query", result);
    const newPost = {
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url,
        ...result,
    };
    res.json(newPost);
});

app.get("/get/wallposts/:user_id", async (req, res) => {
    const result = await getAllPostsFromDBbyRecipientID(req.params.user_id);
    res.json(result);
});

app.get(`/get/wallposts`, async (req, res) => {
    const result = await getAllPostsFromDBbyRecipientID(req.session.user_id);
    res.json(result);
});

app.get("/get/friends", async (req, res) => {
    const result = await getAllFriends(req.session.user_id);
    res.json(result);
});

app.post("/private-message", async (req, res) => {
    const { friend_id, message } = req.body;
    const user_id = req.session.user_id;
    const result = await storePrivateMessage(user_id, friend_id, message);
    res.json(result);
});

app.get("/get/private-messages/:user_id", async (req, res) => {
    const friend_id = req.params.user_id;
    const user_id = req.session.user_id;
    const result = await getAllPrivateMessages(user_id, friend_id);
    res.json(result);
});

app.post("/new-post", async (req, res) => {
    console.log("newPost", req.body);
    const { post } = req.body;
    const user_id = req.session.user_id;
    const result = await storePost(user_id, post);
    res.json(result);
});

app.post(
    "/new-post-image",
    uploader.single("postImg"),
    upload,
    async (req, res) => {
        console.log("newPostImage", req.body);
        const { post, imgUrl } = req.body;
        const user_id = req.session.user_id;
        const result = await storePost(user_id, post, imgUrl);
        res.json(result);
    }
);

app.get("/get/posts", async (req, res) => {
    // get all friends first then use those friends IDs to get all their posts
    const user_id = req.session.user_id;
    const result = await getAllFriends(user_id);
    const friendsIDs = result.map((x) => {
        return x.id;
    });
    const resultPosts = await getPostFromFriends(friendsIDs, user_id);
    res.json(resultPosts);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening...");
});
