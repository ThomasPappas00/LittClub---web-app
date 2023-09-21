'use strict';

const session = require('express-session')
const Pool = require('pg').Pool
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const pool = new Pool({
    user: 'zrimgmcwzzeyhu',
    host: 'ec2-34-233-114-40.compute-1.amazonaws.com',
    database: 'de5fqu6e00qr6v',
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
})

//
function getWelcomePage(req, res){
    console.log('Serve welcome page')
    res.render('welcome')
}

function getTermsPage(req,res){
    console.log('Serve terms page')
    res.render('terms')
}

function getAboutPage(req,res){
    console.log('Serve about page')
    res.render('about')
}

function getFaqPage(req,res){
    console.log('Serve faw page')
    res.render('faq')
}

function getSignupPage(req,res){
    console.log('Serve signup page')
    res.render('signup')
}

function getSigninPage(req,res){
    console.log('Serve signin page')
    res.render('signin')
}

function checkAuthenticated (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if (req.session.isAuth) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
        //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
        if ((req.originalUrl === "/signin") || (req.originalUrl === "/signup")) {
            next()
        }
        else {
            //Στείλε το χρήστη στη "/login" 
            console.log("not authenticated, redirecting to /login")
            res.redirect('/signin');
        }
    }
}

function checkAdminAuthenticated (req, res, next) {
    //if session.is_admin is true, admin is authenticated and next handler is called
    if (req.session.is_admin) {
        console.log("admin is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
        //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
        if ((req.originalUrl === "/signin") || (req.originalUrl === "/signup")) {
            next()
        }
        else {
            //Στείλε το χρήστη στη "/login" 
            console.log("not authenticated as admin, restricted access ahead, redirecting to /login")
            res.redirect('/signin');
        }
    }
}

function signupUser(req,res){
    console.log(req)
    const {email, username, password, confirmPassword, firstname, lastname, profession, city, age, bio , checkbox} = req.body
    
    if(checkbox != 'agree'){                                                                             //clients must check box to  accept the website terms
        return res.render('signup', {message: 'Please accept the terms'})
    }

    if( !firstname || !lastname || !email || !password){                                                   //required entries
        return res.render('signup', {message: 'Please enter email, password, first name and last name'})
    }
 
    if(password != confirmPassword){                                                                    //check matching password - confirmPassword
        return res.render('signup', {message: 'Passwords do not match. Please try again'})
    }

    pool.query('SELECT email FROM users WHERE email = $1', [email], (err, results) => {       
        if (err) {
            throw (err);
        }
        if (results.rows.length > 0) {
            console.log('used emails:' + JSON.stringify(results.rows[0].email))
            return res.render('signup', { message: 'This email is already in use. Please try another one' });   //user must enter unique email
        }
        else{  
            pool.query('SELECT username FROM users WHERE username = $1', [username], async (err, results) => {      
                if (err) {
                    throw (err);
                }
                if (results.rows.length > 0) {
                    console.log('used username:' +  JSON.stringify(results.rows[0]))
                    return res.render('signup', { message: 'This username is already in use. Please try a another one' }); //user must enter unique username
                }
                else{
                    let hashedPassword = await bcrypt.hash(password, 8)           //hash password to store in database
                    console.log('hashed = '+hashedPassword)
                    pool.query('INSERT INTO users (email, username, password, firstname, lastname, profession, age, city, bio, following) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [email, username, hashedPassword, firstname, lastname, profession, age, city, bio, 0], (error, results) => {
                    if (error) {
                        throw(error)
                    }
                    return res.redirect('signin');
                    })
                    console.log('INSERTED USER with username = '+ username)   
                }
            });
        }
    }) 

        

    
}

async function signinUser(req,res,type){
    const {email, password} = req.body;

    if(!email || !password){                                     //required entries
        return res.status(400).render('signin', {
            message: 'Please submit email and password'
        })
    }
    
    console.log('check auth')
    pool.query('SELECT * FROM users WHERE email = $1', [email], async (err,results) => {         //authenticate user
      try{
        if(!results || !(await bcrypt.compare(password, results.rows[0].password))){
            return res.render('signin', {message: 'Incorrect credentials. Please try again'})
        }
        else{
            console.log('lets start session')
            req.session.isAuth = true;                      //authentication variables stored in session object
            req.session.user = results.rows[0].username;    //
            if(email == 'admin@gmail.com'){                 //only this user is admin and pre exists
                req.session.is_admin = true;                //
            }
            return res.redirect('/home');
        }
      }catch{
        return res.render('signin', {message: 'Incorrect credentials. Please try again'})
      }
    });
}

function uploadUserPhoto(req,res){
    console.log('READY TO UPLOAD PHOTO')
    const file = req.file
    const username = req.params.username;   
    console.log(file)
    if(username == req.session.user){
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "../static/photos/users/"  + req.file.filename + ".jpg");   //make path to store user profile photo
    
        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {                 //accept .jpg format
            fs.rename(tempPath, targetPath, err => {
            if (err) throw(err);  
            console.log(req.session.user)  
            const user_photo_src = 'users/' + req.file.filename + '.jpg';
            console.log(user_photo_src)
            pool.query('UPDATE users SET user_photo_src = $1 WHERE username = $2', [user_photo_src, req.session.user], (err,results) => { //save path string in db
                console.log('file uploaded')
                res.redirect('back')
            });
            
            });
        } else {
            fs.unlink(tempPath, err => {
            if (err) throw(err)
    
            res
                .status(403)
                .contentType("text/plain")
                .end("Only .jpg files are allowed!");
            });
        }
    }
    else{
        res.redirect('back')
    }
}

function uploadTopicPhoto(req,res){                         
    console.log('READY TO UPLOAD PHOTO FOR TOPIC')               //same as user photo but in different path
    const file = req.file
    console.log('filename' + req.file.filename)
    console.log(file)
    const topic_id = req.params.topic_id
    console.log('upload photo for topic: ' + topic_id )
    const username = req.params.username;
    
    if(username == req.session.user){
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "../static/photos/topics/"  + req.file.filename + ".jpg");
    
        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
            fs.rename(tempPath, targetPath, err => {
            if (err) throw(err);   
            const topic_photo_src = 'topics/' + req.file.filename + '.jpg';
            console.log(topic_photo_src)        
            pool.query('UPDATE topic SET topic_photo_src = $1 WHERE topic_id = $2', [topic_photo_src, topic_id], (err,results) => {
                console.log('file uploaded')
                return res.redirect('back')
            });  
            });
        }else {
            fs.unlink(tempPath, err => {
            if (err) throw(err)
    
            res
                .status(403)
                .contentType("text/plain")
                .end("Only .jpg files are allowed!");
            });
        }
    }
    else{
        res.redirect('back');
    }
}
//

function searchDatabase(req,res){
    const search = req.body.search;
    console.log('searching for: ' + search);        //three consecutive queries that find users (username,firstname,lastname,city) AND topics(title) AND books(title) that contain the search value given by the user through the search bar on navbar
    pool.query("SELECT username,firstname,lastname,user_photo_src FROM users WHERE username LIKE $1 OR firstname LIKE $1 OR lastname LIKE $1 OR city LIKE $1",[`%${search}%`], (err,results) => {
        if(err) throw err;
        else{
            const parsedUsers =  JSON.parse(JSON.stringify(results.rows));   
            pool.query("SELECT * FROM topic,book WHERE topic.book_id = book.book_id AND topic_title LIKE $1", [`%${search}%`], (err,results) => {
                if(err) throw err;
                else{
                    const parsedTopics =  JSON.parse(JSON.stringify(results.rows)); 
                    pool.query("SELECT * FROM book WHERE book_title LIKE $1",  [`%${search}%`], (err,results) => {
                        const parsedBooks =  JSON.parse(JSON.stringify(results.rows)); 
                        const parsedAnswer = {user: parsedUsers, topic: parsedTopics, book: parsedBooks}
                        res.render('search', parsedAnswer)
                    });
                }
            });
        }
    });
}

function getMyProfilePage(req,res){
    console.log('GET MY PROF PAGE')
    res.redirect('/profile/' + req.session.user)
}

function getHomePage(req,res){
    console.log('GET HOME PAGE');
    const username = req.session.user;
    console.log('username : ' + username);                  //query that returns only the topics created by other people, so they are shown as recommended/getting started material in home page
    pool.query(`SELECT distinct topic.*,book.* FROM users,creates,topic,book WHERE topic.topic_id = creates.topic_id AND    
    creates.user_id != (SELECT user_id FROM users WHERE username = $1) and topic.book_id = book.book_id`, [username], (err,results) => {
        let parsedTopic = JSON.parse(JSON.stringify(results.rows));
        res.render('home', {topic: parsedTopic})
    });
}

function getMyTopicsPage(req,res){
    console.log('MY TOPICS PAGE')                    //topics the user has created                                                                                   
    pool.query(`select topic.*,book.* from users,topic,creates,book 
    where users.username = $1 and users.user_id = creates.user_id and creates.topic_id = topic.topic_id AND topic.book_id = book.book_id`, [req.session.user], (err,results) => { 
        const parsedAnswer = JSON.parse(JSON.stringify(results.rows))
        res.render('topics', {topic:parsedAnswer})
    })    
}

function getMyFavoritesPage(req,res){
    console.log('MY FAV PAGE')                       //topics the user has followd
    pool.query(`select topic.*,book.* from users,topic,follows_topic, book 
    where users.username = $1 and users.user_id = follows_topic.user_id and follows_topic.topic_id = topic.topic_id AND topic.book_id = book.book_id`, [req.session.user], (err,results) => { 
        const parsedAnswer = JSON.parse(JSON.stringify(results.rows))
        res.render('favorites', {topic:parsedAnswer})
    })  
}

function getCreateBookPage(req,res){
    console.log('Serve create book page')                       //create a new book entry or simply skip this section and redirect to createTopic (shown in page)
    res.render('createbook')
}

function getCreateTopicPage(req,res){
    console.log('Serve create topic page')
    pool.query('SELECT * FROM BOOK', (err, results) => {        //recommend the books that exist in the db for linking them to the new topic
        if(err)
            throw err
        else{
            let parsedBooks = JSON.parse(JSON.stringify(results.rows))
            res.render('createtopic', {book: parsedBooks})
        }
    })
}

function postBook(req,res){
    console.log('post new book')
    const {book_title, author, translator, publish_date} = req.body;
    pool.query('INSERT INTO book (book_title, author, translator, publish_date) VALUES ($1, $2, $3, $4)', [book_title, author, translator, publish_date], (err, results) => {
        if(err)
            throw err
        else{
            res.redirect('/createtopic')
        }
    })
}

function postTopic(req,res){
    console.log('post new topic')
    console.log(req.body)
    const {book_id, topic_title, description} = req.body
    pool.query('INSERT INTO topic(book_id, topic_title, description)  VALUES ($1,$2,$3)', [book_id, topic_title, description], (err, results) => {
        if(err) 
            throw err;
        else{               //make enrty to CREATES table and the database engine inserts date and time created
            pool.query(`INSERT INTO creates(user_id, topic_id)  VALUES (
                (SELECT user_id FROM users WHERE username = $1), (SELECT topic_id FROM topic WHERE topic_id=(SELECT max(topic_id) FROM topic))  
            )`, [req.session.user], (err, results) => {
                if(err)
                    throw err
                else{
                    console.log('topic created and creates created')
                    res.redirect('/topics')
                }
            });
        }
    });
}

function postComment(req,res){
    const topic_id = req.params.topic_id;
    const username = req.session.user;
    const comment = req.body.comment;
    console.log(username + 'posted comment: '+comment + 'on topicid: ' + topic_id);
    pool.query('SELECT user_id FROM users WHERE username = $1', [username], (err,results) => {
        if(err)
            throw err
        else{
            const user_id = results.rows[0].user_id;        //post new comment to db for user and topic commented
            pool.query('INSERT INTO comments(user_id, topic_id, comment) VALUES($1,$2,$3)', [user_id, topic_id, comment], (err,results) => {
                if(err)
                    throw err
                else{   
                    return res.redirect('back'); 
                }
            }); 
        }      
    });
}


function getProfilePage(req,res){
    const username = req.params.username
    console.log('GET USER :' + username)
    pool.query('SELECT * FROM users WHERE username = $1', [username], (err,results) => {
        if(err)
            throw err
        else{   
            delete results.rows[0].password;            //do not forwar hashed password to the client
            let parsedUsers = JSON.parse(JSON.stringify(results.rows[[0]]))
            if(req.session.is_admin && parsedUsers.is_admin){
                parsedUsers.admin_access = true;
            }   
            pool.query('SELECT topic.*,creates.topic_created_on,book.* FROM users,topic,creates,book WHERE users.user_id = creates.user_id AND creates.topic_id = topic.topic_id AND users.user_id = $1 AND topic.book_id = book.book_id ORDER BY topic_created_on ASC', [parsedUsers.user_id], (err,results) => {
                let parsedTopics = JSON.parse(JSON.stringify(results.rows)) 
                pool.query( `SELECT topic.*,book.* FROM users,topic,book,follows_topic WHERE users.user_id = follows_topic.user_id AND follows_topic.topic_id = topic.topic_id AND users.user_id = $1 AND topic.book_id = book.book_id`, [parsedUsers.user_id], (err,results) => {
                    let parsedFavorites= JSON.parse(JSON.stringify(results.rows))
                    parsedUsers.mytopics = Object.keys(parsedTopics).length;
                    parsedUsers.favorites = Object.keys(parsedFavorites).length;
                    let parsedAnswer = {user: parsedUsers, topic: parsedTopics, favorite: parsedFavorites}; //render user, his created and favorite (following) topics' data
                    return res.render('profile', parsedAnswer);
                });
            });       
        }
    });
}

function getTopicPage(req,res){
    const topic_id = req.params.topic_id
    console.log('GET TOPIC with id: ' + topic_id)

    pool.query(`SELECT * FROM users,creates,topic,book WHERE topic.topic_id = $1 AND topic.book_id = book.book_id AND topic.topic_id = 
        creates.topic_id AND creates.user_id = users.user_id`, [topic_id], (err, results) => {    //get data for specific topic
            if (err) throw err;
            let parsedTopic = JSON.parse(JSON.stringify(results.rows[[0]]));
            delete parsedTopic.password
            pool.query('SELECT COUNT(user_id) FROM follows_topic WHERE follows_topic.topic_id = $1', [topic_id], (err,results) => {  //get number of accounts folllowing this topic
                if(err) throw err;
                parsedTopic.followers = results.rows[0].count;
                pool.query('SELECT  CAST(AVG(stars) AS DECIMAL(1,0)) FROM rates WHERE topic_id = $1', [topic_id], (err, results) => {   //get avarage rating for this topic from the users
                    if(err) throw err;
                    parsedTopic.stars = results.rows[0].avg;
                    pool.query(`SELECT users.username, users.firstname, users.lastname, users.user_photo_src, comments.comment, comments.comment_created_on FROM       
                    users,comments, topic WHERE topic.topic_id = $1 AND comments.topic_id = topic.topic_id and comments.user_id = users.user_id ORDER BY comment_created_on ASC`, [topic_id], (err,results) => {   //get data about comments on this topic
                        if(err) throw err;
                        let parsedComments = JSON.parse(JSON.stringify(results.rows));
                        parsedTopic.comments = parsedComments; 
                        if(req.session.user == parsedTopic.username){
                            parsedTopic.belongs = true;
                        }
                        pool.query('SELECT * FROM follows_topic WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND topic_id = $2',[req.session.user, parsedTopic.topic_id], (err, results) => { //variable to render following icon 
                            if (err) throw err;
                            if(results.rows[0]){
                                parsedTopic.is_following = true;
                            }
                            pool.query('SELECT * FROM rates WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND topic_id = $2',[req.session.user, parsedTopic.topic_id], (err, results) => {    //variable to render star rating bar for the first time rating or not
                                if (err) throw err;
                                if(results.rows[0]){
                                    parsedTopic.has_rated = true;
                                }else{
                                    parsedTopic.has_rated = false;
                                }
                                res.render('comments', parsedTopic);
                            });
                        });
                    });
                });
            });
        });
}



function getBookPage(req,res){
    const book_id = req.params.book_id
    console.log('GET TOPICS of BOOK with id: ' + book_id);
    pool.query('SELECT * FROM book WHERE book_id = $1', [book_id], (err,results) => {           
        if(err) throw err;
        let parsedBook = JSON.parse(JSON.stringify(results.rows[[0]]));
        pool.query('SELECT users.username, users.firstname, users.lastname, topic.* FROM users, topic,book,creates WHERE creates.user_id = users.user_id AND creates.topic_id = topic.topic_id AND topic.book_id = book.book_id AND book.book_id = $1', [book_id], (err,results) => {
            if(err) throw err;
            let parsedTopic = JSON.parse(JSON.stringify(results.rows));
            //console.log('topic: '+ JSON.stringify(parsedTopic));
            parsedBook.topic = parsedTopic
            res.render('book', parsedBook);                     //renders topics created and linked to this specific book
        });
    });
}

function getAuthorPage(req,res){
    const author = req.params.author;
    console.log('GET BOOKS PAGE FOR AUTHOR: ' + author);
    let parsedAnswer = {author};
    pool.query('SELECT * FROM book WHERE author = $1', [author], (err,results) => {             //get all the books associated with this author name
        let parsedBook = JSON.parse(JSON.stringify(results.rows));
        parsedAnswer.book = parsedBook;
        //console.log('books: '+ JSON.stringify(parsedAnswer));
        res.render('author', parsedAnswer);
    });
}


function followTopic(req,res){
    const topic_id = req.params.topic_id;
    const username = req.session.user;
    console.log(username + ' started following topic: ' + topic_id);
    pool.query('SELECT user_id FROM users WHERE username = $1', [username], (err,results) => {
        if(err)
            throw err
        else{
            const user_id = results.rows[0].user_id;
            console.log('USER ID  =' + user_id)
            pool.query('INSERT INTO follows_topic(user_id,topic_id) VALUES($1,$2)', [user_id, topic_id], (err,results) => { //follow topic entry for user
                if (err)
                    throw err
                else{
                    return res.redirect('back');                //check if works!!!
                }
            });
        }      
    });
}

function postRateTopic(req,res){
    const topic_id = req.params.topic_id;
    const stars = req.params.stars;
    const username = req.session.user;
    console.log(username + ' started following topic: ' + topic_id);
    pool.query('SELECT user_id FROM users WHERE username = $1', [username], (err,results) => {
        if(err)
            throw err
        else{
            const user_id = results.rows[0].user_id;
            pool.query('DELETE FROM rates WHERE user_id = $1 AND topic_id = $2', [user_id, topic_id], (err,results) => {  //dlete old rating from db
                if(err)
                    throw err
                else{
                    pool.query('INSERT INTO rates(user_id, topic_id, stars) VALUES($1,$2,$3)', [user_id, topic_id, stars], (err,results) => {   //insert new rating
                        if(err)
                            throw err
                        else{
                            console.log('Rated ' + topic_id + 'with ' + stars + 'stars')    
                            return res.redirect('back'); 
                        }
                    });
                }
            }); 
        }      
    });
}

function unfollowTopic(req,res){
    const topic_id = req.params.topic_id;
    const username = req.session.user;
    console.log(username + ' unfollowed topic: ' + topic_id);
    pool.query('SELECT user_id FROM users WHERE username = $1', [username], (err,results) => {
        if(err)
            throw err
        else{
            const user_id = results.rows[0].user_id;
            pool.query('DELETE FROM follows_topic WHERE user_id = $1 AND topic_id = $2', [user_id, topic_id], (err,results) => { //unfollow topic by deleting follows_topic entry for user
                if (err)
                    throw err
                else{
                    return res.redirect('back');                //check if works!!!
                }
            });
        }      
    });
}

function deleteTopic(req,res){
    const topic_id = parseInt(req.params.topic_id);
    console.log('DELETING TOPIC WITH ID = '+ topic_id);
    pool.query('DELETE FROM topic WHERE topic_id = $1', [topic_id], (err,results) => {      //deleting single topic (only the creator of it and the admin can do this action - enabled by their interface)
        if (err) throw err;
        else{
            console.log('TOPIC DELETED')
            res.redirect('/home');
        }
    });
}

function deleteUser(req,res){
    const username = req.params.username;
    console.log('DELETING USER WITH USERNAME = '+ username);
    pool.query('DELETE FROM users WHERE username = $1', [username], (err,results) => {  //admin only capability
        if (err) throw err;
        else{
            console.log('USER DELETED')
            res.redirect('/home');
        }
    });
}

function getTopicEdit(req,res){
    console.log('ADMIN READY TO EDIT TOPICS');
    pool.query('SELECT * FROM topic,book WHERE topic.book_id = book.book_id', (err,results) => {        
        let parsedTopic = JSON.parse(JSON.stringify(results.rows));
        console.log('topics: ' + JSON.stringify(parsedTopic))
        res.render('topicedit', {topic: parsedTopic})       //rendering all the topics so they can be deleted or not (admin only)
    });
}

function getUserEdit(req,res){
    const username = req.session.user;
    console.log('ADMIN READY TO EDIT USERS')
    pool.query(`SELECT username, firstname, lastname, user_photo_src FROM users WHERE username != $1`,[username], (err,results) => {
        let parsedUsers = JSON.parse(JSON.stringify(results.rows));
        console.log('users: ' + JSON.stringify(parsedUsers))
        res.render('useredit', {user: parsedUsers})             //rendering all the users so they can be deleted or not (admin only)
    });
}

///
function getTermsLoggedPage(req,res){
    console.log('Serve terms LOGGED page')
    res.render('termslogged')
}

function getAboutLoggedPage(req,res){
    console.log('Serve about LOGGED page')
    res.render('aboutlogged')
}

function getFaqLoggedPage(req,res){
    console.log('Serve faQ LOGGED page')
    res.render('faqlogged')
}

function doLogOut(req,res){
    req.session.destroy();                  //destroy session (logging out) and redirect the user to the welcome page
    res.redirect('/');
}

module.exports = {                       //export all module functions
    getWelcomePage,
    getTermsPage,
    getAboutPage,
    getFaqPage,
    getSignupPage,
    getSigninPage,
    signupUser,
    signinUser,
    checkAuthenticated,
    checkAdminAuthenticated,
    uploadUserPhoto,
    uploadTopicPhoto,
    getMyProfilePage,
    doLogOut,
    searchDatabase,
    getHomePage,
    getTermsLoggedPage,
    getAboutLoggedPage,
    getFaqLoggedPage,
    getMyFavoritesPage,
    getMyTopicsPage,
    getCreateBookPage,
    getCreateTopicPage,
    postBook,
    postTopic,
    postComment,
    getProfilePage,
    getTopicPage,
    getBookPage,
    getAuthorPage,
    followTopic,
    postRateTopic,
    unfollowTopic,
    deleteTopic,
    deleteUser,
    getTopicEdit,
    getUserEdit
}
