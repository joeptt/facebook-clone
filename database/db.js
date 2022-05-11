const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/socialnetwork`);
const bcrypt = require("bcryptjs");

function getUserByEmail(email) {
    // finds user by email on database
    return db.query(`
        SELECT * FROM users WHERE email = '${email}'
    `);
}

module.exports.logInCheck = function ({ email, password }) {
    return getUserByEmail(email)
        .then((user) => {
            return bcrypt
                .compare(password, user.rows[0].password_hashed)
                .then((match) => {
                    if (match) {
                        // if the two passwords match return the users data
                        return user.rows[0];
                    } else {
                        return null;
                    }
                })
                .catch((err) => console.log("error at comparing PWs", err));
        })
        .catch((err) => console.log("error on finding user by email", err));
};

module.exports.storeUserOnDB = function ({
    first_name,
    last_name,
    email,
    hashed_password,
}) {
    const query = `
        INSERT INTO users (first_name, last_name, email, password_hashed)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [first_name, last_name, email, hashed_password];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.getProfileInfoOfLoggedInUser = function (user_id) {
    const query = `
        SELECT * FROM users WHERE id = $1
    `;
    const params = [user_id];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.addImageToDatabase = function (imgUrl, user_id) {
    const query = `
        UPDATE users 
        SET profile_picture_url = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [imgUrl, user_id];
    return db.query(query, params);
};

module.exports.checkForValidEmail = function ({ email }) {
    const query = `
        SELECT * FROM users WHERE email = $1
    `;
    const params = [email];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.storePasswordCode = function (code, email) {
    const query = `
       INSERT INTO password_reset_codes (code, email)
       VALUES ($1, $2)
       RETURNING *
    `;
    const params = [code, email];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.compareCodes = function ({ code }) {
    const query = `
        SELECT * FROM password_reset_codes 
        WHERE code = $1
    `;
    const params = [code];
    return db.query(query, params).then((result) => result.rows[0]);
};
