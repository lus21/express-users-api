const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');

const app = express();
  
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

const users = [];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/time', (req, res) => {
    res.send(new Date());
});

app.get('/form', (req, res) => {
    res.render('addUser', { title: "Add new user" });
});

app.post('/form', (req, res) => {
    req.check('username').notEmpty().withMessage('Username is required');
    req.check('password', 'passwords must be at least 5 chars').isLength({ min: 5 });
    req.check('gender').notEmpty().withMessage('Gender is required');
    req.check('agree').isBoolean().withMessage('Agree with must be a boolean');
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        res.render('addUser', {
            errors,
        });
    } else {
        const user = {
            username: req.body.username,
            password: req.body.password,
            gender: req.body.gender,
            agree: req.body.agree,
        };
        users.push(user);
        res.redirect('/result')
    }
});

app.get('/result', (req, res) => {
    res.render('result', { title: "All users", users: users });
});

//API Routes

app.get('/api/time', (req, res) => {
    res.json({'time': new Date()});
});

app.post('/api/users', (req, res) => {
    req.check('username').notEmpty().withMessage('Username is required');
    req.check('password', 'passwords must be at least 5 chars').isLength({ min: 5 });
    req.check('gender').notEmpty().withMessage('Gender is required');
    req.check('agree').isBoolean().withMessage('Agree with must be a boolean');
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
        res.json(errors);
    } else {
        const user = {
            username: req.body.username,
            password: req.body.password,
            gender: req.body.gender,
            agree: req.body.agree,
        };
        users.push(user);
    }
    res.end();
});

app.get('/api/users', (req, res) => {
    res.json(users);
});

//404 Page
app.use((req, res, next) => {
    res.status(404);

    res.format({
        html: function () {
            res.render('404', { url: req.url })
        },
        json: function () {
            res.json({ error: 'Not found' })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    })
});

app.listen(3000, () => {
    console.log('server started')
});