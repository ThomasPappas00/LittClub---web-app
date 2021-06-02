'use strict';

const model = require('../model/app-model-postgresql');
const path = require('path')
const rel_path = '../pages';

function getWelcomePage(req, res){
    res.sendFile('welcome.html', { root: path.join(__dirname, rel_path) }, (err) => {
        if (err) {
            throw(err);
        } else {
            console.log('Send welcome page');
        }
    })

    model.selAllFromBook()
}

function getTermsPage(req,res){
    res.sendFile('terms.html', { root: path.join(__dirname, rel_path) }, (err) => {
        if (err) {
            throw(err);
        } else {
            console.log('Send terms page');
        }
    })
}


function getAboutPage(req,res){
    res.sendFile('about.html', { root: path.join(__dirname, rel_path) }, (err) => {
        if (err) {
            throw(err);
        } else {
            console.log('Send about page');
        }
    })
}


function getFaqsPage(req,res){
    res.sendFile('faqs.html', { root: path.join(__dirname, rel_path) }, (err) => {
        if (err) {
            throw(err);
        } else {
            console.log('Send terms page');
        }
    })
}
module.exports = {
    getWelcomePage,
    getTermsPage,
    getAboutPage,
    getFaqsPage
}