# LittClub - The social media platform for book enthusiasts
LittClub is a web application - social media platform where people can express their passion for books and literature. The user can easily create an account with their personal email address and access the features of the website. They can be informed in the news feed/home page, customize their profile (info, bio, profile picture) and create Topics on books. A Topic is a discussion area where users can comment about a book and their author. People can follow a Favorite topic (red book sign), review topics (5-star-review-system) and follow other users to create a friends’ network and keep up with everyone’s activity.

## Description
For the back-end, we used a PostgreSQL database and a node.js web server with express.js that follows the Model-View-Controller (MVC) design. The Handlebars.js template is used at the front-end, as long as CSS and JavaScript. Only password hashes are saved in the database and the users’ sessions are controlled with cookies. The application was running for 1.5 years on the Heroku cloud platform and had a small number of users.

## Instructions
Open a terminal from the current folder

1) Initialize a PostgreSQL database based on the _data/database.sql_ file

2) run: _$npm install_

--> to install dependencies

3) run: _$npm run debug_ <br />
        or <br />
        _$npm run watch_ <br />
        
--> to start the server <br />

4) the server is now listening in localhost and PORT:3000

## Demo
https://github.com/ThomasPappas00/LittClub---web-app/assets/75483971/8af622c4-bb67-4841-8570-f4db86eebba2

## License

[MIT](https://choosealicense.com/licenses/mit/)

