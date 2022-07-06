const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/socialnetwork`);
const bcrypt = require("bcryptjs");

function getUserByEmail(email) {
    // finds user by email on database
    return db.query(
        `
        SELECT * FROM users WHERE email = $1
    `,
        [email]
    );
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

module.exports.storeBioOnDb = function (bio, user_id) {
    const query = `
        UPDATE users 
        SET bio = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [bio, user_id];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.updatingPassword = function (hashed_password, user_id) {
    const query = `
        UPDATE users 
        SET password_hashed = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [hashed_password, user_id];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.searchUsersInput = async function (input, user_id) {
    try {
        const params = [input + "%", user_id];
        const query = `
            SELECT * FROM users
            WHERE NOT id = $2
            AND (first_name ILIKE $1 OR last_name ILIKE $1)
            LIMIT 5
        `;
        const result = await db.query(query, params);
        console.log(result.rows);
        if (result.rows.length < 1) return null;
        return result.rows;
    } catch (error) {
        console.log("Error at search -> ", error);
    }
};

module.exports.recentlyAddedUsers = async function (user_id) {
    try {
        const params = [user_id];
        const query = `
            SELECT * FROM users
            WHERE NOT id = $1
            ORDER BY created_at DESC
            LIMIT 3
        `;
        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        console.log("Error on pre-populating search bar -> ", error);
    }
};

module.exports.getUserById = function (user_id) {
    const params = [user_id];
    const query = `
        SELECT * FROM users 
        WHERE id = $1
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.getFriendshipStatus = function (ownUser, otherUser) {
    const params = [ownUser, otherUser];
    const query = `
        SELECT * FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1);
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.deleteRowFromFriendships = function (ownUser, otherUser) {
    const params = [ownUser, otherUser];
    const query = `
        DELETE FROM friendships 
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        RETURNING *
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.addRequestToFriendships = function (ownUser, otherUser) {
    const params = [ownUser, otherUser];
    const query = `
        INSERT INTO friendships (sender_id, recipient_id, accepted)
        VALUES ($1, $2, false)
        RETURNING *
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.acceptFriendship = function (ownUser, otherUser) {
    const params = [ownUser, otherUser];
    const query = `
        UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1); 
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.endFriendship = function (ownUser, otherUser) {
    const params = [ownUser, otherUser];
    const query = `
        DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1); 
    `;
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.addCoverPhoto = function (imgUrl, user_id) {
    const query = `
        UPDATE users 
        SET cover_picture_url = $1
        WHERE id = $2
        RETURNING *
    `;
    const params = [imgUrl, user_id];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.getAllFriendsAndWannabes = function (user_id) {
    const query = `
        SELECT users.id, first_name, last_name, profile_picture_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `;
    const params = [user_id];
    return db.query(query, params).then((result) => result.rows);
};

module.exports.getRecentChatMessage = function () {
    return db
        .query(
            `
            SELECT chat_messages.*, users.first_name, users.last_name, users.profile_picture_url
            FROM chat_messages
            JOIN users
            ON users.id = chat_messages.sender_id
            ORDER BY created_at DESC
            LIMIT 10
            `
        )
        .then((result) => result.rows);
};

module.exports.storeMessageOnDb = function (sender_id) {
    console.log("this is sender_id", sender_id.sender_id);
    const query = `
        INSERT INTO chat_messages (sender_id, text)
        VALUES ($1, $2)
        RETURNING *
    `;
    const params = [sender_id.sender_id, sender_id.text];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.storeWallPostInDb = function (post, sender_id, recipient_id) {
    const query = `
        INSERT INTO wall_posts (post, sender_id, recipient_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const params = [post, sender_id, recipient_id];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.getAllPostsFromDBbyRecipientID = function (recepient_id) {
    const query = ` 
    SELECT wall_posts.id AS id, users.first_name AS first_name, users.last_name AS last_name, users.profile_picture_url AS profile_picture_url, wall_posts.post AS post
    FROM wall_posts
    LEFT JOIN users
    ON users.id = wall_posts.sender_id
    WHERE recipient_id = $1  
    `;
    const params = [recepient_id];
    return db.query(query, params).then((result) => result.rows);
};

module.exports.getAllFriends = function (user_id) {
    const query = `
        SELECT users.id, first_name, last_name, profile_picture_url, accepted
        FROM friendships
        JOIN users
        ON (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `;
    const params = [user_id];
    return db.query(query, params).then((result) => result.rows);
};

module.exports.storePrivateMessage = function (sender_id, recepient_id, text) {
    const query = `
        INSERT INTO private_chat_messages (sender_id, recipient_id, text)
        VALUES ($1, $2, $3)
        RETURNING * 
    `;
    const params = [sender_id, recepient_id, text];
    return db.query(query, params).then((result) => result.rows[0]);
};

module.exports.getAllPrivateMessages = function (sender_id, recipient_id) {
    const query = `
        SELECT * FROM private_chat_messages
        WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1) 
    `;
    const params = [sender_id, recipient_id];
    return db.query(query, params).then((result) => result.rows);
};
