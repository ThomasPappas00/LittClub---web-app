'use strict';

const express = require('express');
const router = express.Router();

const appFetchController = require('../controller/app-fetch-controller');
const logInController = require('../controller/log-in-controller')

router.get('/', (req,res) => {res.redirect('/welcomepage')});

router.get('/welcome', appFetchController.getWelcomePage);
router.get('/terms', appFetchController.getTermsPage);
router.get('/about', appFetchController.getAboutPage);
router.get('/faqs', appFetchController.getFaqsPage);


/*
router.get('/signup', logInController.checkAuthenticated, logInController.showSignupForm)
router.post('/signup', appFetchController.doSignup);

router.get('/login', logInController.checkAuthenticated, logInController.showLoginForm)
router.post('/login', logInController.doLogin);

router.get('/logout', logInController.doLogout);

router.get('/profile/:username', logInController.checkAuthenticated, appFetchController.getProfilePage)
router.get('/makeprofile', logInController.checkAuthenticated, appFetchController.getProfileForm)
router.post('/makeprofile', logInController.checkAuthenticated, appFetchController.makeProfile)

router.get('/topic/:title', logInController.checkAuthenticated, appFetchController.getTopicPage)
router.get('/maketopic', logInController.checkAuthenticated, appFetchController.getTopicForm)
router.post('/maketopic', logInController.checkAuthenticated, appFetchController.makeTopic)

router.get('/book/:title', logInController.checkAuthenticated, appFetchController.getTopicPage)
router.get('/maketopic', logInController.checkAuthenticated, appFetchController.getTopicForm)
router.post('/maketopic', logInController.checkAuthenticated, appFetchController.makeTopic)

router.get('/follows/topic/:title', logInController.checkAuthenticated, appFetchController.doFollowTopic)
router.get('/follows/user/:username', logInController.checkAuthenticated, appFetchController.doFollowUser)

router.post('/topic/comment/:title', logInController.checkAuthenticated, appFetchController.addComment)
router.get('/topic/rate/:title/:stars', logInController.checkAuthenticated, appFetchController.addRating)
*/

module.exports = router;