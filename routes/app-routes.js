'use strict';

const express = require('express');
const app = require('../app');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const upload = multer({dest: path.join(__dirname, '../static/photos')});
const appFetchController = require('../controller/app-fetch-controller'); //controller object that serves the clients' requests on paths

router.get('/', (req,res) => {res.redirect('/welcome')});

router.get('/welcome', appFetchController.getWelcomePage);                   //functions that render static pages for non signed in users
router.get('/terms', appFetchController.getTermsPage);
router.get('/about', appFetchController.getAboutPage);
router.get('/faq', appFetchController.getFaqPage);

router.get('/signup', appFetchController.checkAuthenticated,appFetchController.getSignupPage);          //checkAuthenticated middleware checks if the client is authenticated and if it is true, it passes control to the next middleware called in the router.method()    
router.get('/signin', appFetchController.checkAuthenticated,appFetchController.getSigninPage);         
router.post('/signup', appFetchController.signupUser);                                                      //sign up new user
router.post('/signin', appFetchController.signinUser);                                                       //sign in user with email and password
router.get('/logout', appFetchController.checkAuthenticated,appFetchController.doLogOut);                   //logout user
router.post('/upload_user_photo', appFetchController.checkAuthenticated, upload.single('file'), appFetchController.uploadUserPhoto);     //upload photo for profile picture
router.post('/upload_topic_photo/:topic_id', appFetchController.checkAuthenticated, upload.single('file'), appFetchController.uploadTopicPhoto);  //upload photo for topic picture

router.get('/home', appFetchController.checkAuthenticated, appFetchController.getHomePage);                 //home page for users (singed in clients)
router.get('/profile', appFetchController.checkAuthenticated, appFetchController.getMyProfilePage);         //profile page of user browsing    
router.get('/topics', appFetchController.checkAuthenticated, appFetchController.getMyTopicsPage);           //original topics page of user
router.get('/favorites', appFetchController.checkAuthenticated, appFetchController.getMyFavoritesPage);      //topics that the user is following
router.get('/termslogged', appFetchController.checkAuthenticated, appFetchController.getTermsLoggedPage);   //previously static paged are now dynamic
router.get('/aboutlogged', appFetchController.checkAuthenticated, appFetchController.getAboutLoggedPage);   //
router.get('/faqlogged', appFetchController.checkAuthenticated, appFetchController.getFaqLoggedPage);           //
router.post('/search', appFetchController.checkAuthenticated, appFetchController.searchDatabase);                  //renders search results from the search bar (users, topics, books)

router.get('/createbook', appFetchController.checkAuthenticated, appFetchController.getCreateBookPage);     //render page for creating new book
router.get('/createtopic', appFetchController.checkAuthenticated, appFetchController.getCreateTopicPage);   //render page for creating new topic
router.post('/createbook', appFetchController.checkAuthenticated, appFetchController.postBook);             //posts new entry of a book to db
router.post('/createtopic', appFetchController.checkAuthenticated, appFetchController.postTopic);           //posts new topic about a known book 
router.post('/createcomment/:topic_id', appFetchController.checkAuthenticated, appFetchController.postComment);     //post comment to a topic
router.get('/deletetopic/:topic_id', appFetchController.checkAuthenticated, appFetchController.deleteTopic);    //topic creator can delete his topic 

router.get('/profile/:username', appFetchController.checkAuthenticated, appFetchController.getProfilePage);         //get profile page of a user
router.get('/topic/:topic_id', appFetchController.checkAuthenticated, appFetchController.getTopicPage);             //get topic page (discussions, etc.)
router.get('/book/:book_id', appFetchController.checkAuthenticated, appFetchController.getBookPage);                //get topics that are linked to a book            
router.get('/author/:author', appFetchController.checkAuthenticated, appFetchController.getAuthorPage);             // get books that are linked to an author

router.get('/follow_topic/:topic_id', appFetchController.checkAuthenticated, appFetchController.followTopic);       //user starts following topic
router.get('/rate_topic/:topic_id/:stars', appFetchController.checkAuthenticated, appFetchController.postRateTopic);    //user rates topic (0-5) stars
router.get('/unfollow_topic/:topic_id', appFetchController.checkAuthenticated, appFetchController.unfollowTopic);      //user stops following topic

router.get('/deleteuser/:username', appFetchController.checkAdminAuthenticated, appFetchController.deleteUser); //if checkAdminAuthenticated passes control to the next middleware (meaning the user is a littclub admin), access to restricted pages is enabled (i.e. delete user account)
router.get('/topicedit', appFetchController.checkAdminAuthenticated, appFetchController.getTopicEdit);  //admin sees all topics and being able to delete them
router.get('/useredit', appFetchController.checkAdminAuthenticated, appFetchController.getUserEdit);    //admin sees all users and can delete their accounts


module.exports = router;