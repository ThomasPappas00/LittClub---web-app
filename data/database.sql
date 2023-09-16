CREATE SCHEMA public;
grant usage on schema public to public;
grant create on schema public to public;

CREATE TABLE IF NOT EXISTS USERS(
    user_id serial PRIMARY KEY,
    email varchar(30) UNIQUE NOT NULL,
    username varchar(30) UNIQUE NOT NULL,
    password varchar(70) NOT NULL,
    firstname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    profession varchar(20),
    age int,
    city varchar(20),
    bio varchar(50),
    followers int,
    following int,
    user_photo_src varchar(50),
    is_admin boolean
);

CREATE TABLE IF NOT EXISTS FOLLOWS(
    id_follower serial,
    id_following serial,
    FOREIGN KEY(id_follower) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY(id_following) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BANS(
    user_id serial,
    admin_id serial,
    reason varchar(50),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id),
    FOREIGN KEY (admin_id) REFERENCES USERS (user_id)
);

CREATE TABLE IF NOT EXISTS BOOK(
    book_id serial PRIMARY KEY,
    book_title varchar(30) NOT NULL,
    author varchar(20),
    translator varchar(20),
    publish_date date
);

CREATE TABLE IF NOT EXISTS TOPIC(
    topic_id serial PRIMARY KEY,
    book_id serial,
    topic_title varchar(40) UNIQUE NOT NULL,
    description varchar(200) NOT NULL,
    topic_photo_src varchar(50),
    FOREIGN KEY (book_id) REFERENCES BOOK (book_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CREATES(
    user_id serial,
    topic_id serial,
    topic_created_on timestamp DEFAULT CURRENT_TIMESTAMP(0),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS COMMENTS(
    user_id serial,
    topic_id serial,
    comment varchar(500) NOT NULL,
    comment_created_on timestamp DEFAULT CURRENT_TIMESTAMP(0),
    FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RATES(
    user_id serial,
    topic_id serial,
    stars int,
    FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id) ON DELETE CASCADE,
    CHECK (stars>=1 AND stars<=5)
);

CREATE TABLE IF NOT EXISTS FOLLOWS_TOPIC(
    user_id serial,
    topic_id serial,
    FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DELETES(
    admin_id serial,
    topic_id serial,
    reason varchar(50),
    FOREIGN KEY (admin_id) REFERENCES USERS (user_id),
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id)
);
