CREATE TABLE IF NOT EXISTS USERS(
    user_id serial PRIMARY KEY,
    email varchar(20) UNIQUE NOT NULL,
    username varchar(20) UNIQUE NOT NULL,
    password varchar(50) NOT NULL,
    firsname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    profession varchar(20),
    age int,
    city varchar(20),
    bio varchar(40),
    followers int,
    following int,
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
    title varchar(20) NOT NULL,
    author varchar(20),
    translator varchar(20),
    publish_date date
);

CREATE TABLE IF NOT EXISTS TOPIC(
    topic_id serial PRIMARY KEY,
    book_id serial,
    title varchar(20) UNIQUE NOT NULL,
    description varchar(200) NOT NULL,
    photo_src varchar(20),
    FOREIGN KEY (book_id) REFERENCES BOOK (book_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CREATES(
    user_id serial,
    topic_id serial,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS (user_id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES TOPIC (topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS COMMENTS(
    user_id serial,
    topic_id serial,
    comment varchar(500) NOT NULL,
    created_on timestamp DEFAULT CURRENT_TIMESTAMP,
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
