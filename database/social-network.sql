DROP TABLE IF EXISTS chate_messages;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS password_reset_codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL CHECK (first_name != ''),
    last_name VARCHAR NOT NULL CHECK (last_name != ''),
    email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
    profile_picture_url TEXT,
    cover_picture_url TEXT,
    bio TEXT,
    password_hashed VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE password_reset_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(6) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (   
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) NOT NULL,
  recipient_id INT REFERENCES users(id) NOT NULL,
  accepted BOOLEAN DEFAULT false
);

CREATE TABLE chat_messages (
    id              SERIAL PRIMARY KEY,
    sender_id       INT REFERENCES users(id) NOT NULL,
    text            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);