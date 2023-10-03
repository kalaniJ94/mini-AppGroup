// imports
const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// prevent users who are not logged in from seeing the home page
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            // exclude the users pass 
            attributes: {exclude: ['password']},
            // order by name asc
            order: [['name', 'ASC']],
        });

        const users = userData.map((project) => project.get({ plain: true }));

        // render 
        res.render('homepage', {
            // users
            users,
            // logged in 
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // if the session exists send the request to the homepage
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    // else render the login page
    res.render('login');
})