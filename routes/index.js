var express = require('express');
const { route } = require('../app');
const mysql = require('mysql');

const knex = require("../db/knex");

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app'
});


var router = express.Router();

/* GET home page. */

router.get("/", (req, res, next) => {

  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  console.log(`is Auth: ${isAuth}`);

  knex("tasks")
    .select("*")
    .then(function (results) {
      console.log(results);
      res.render('index', {
        title: 'Todo App',
        todos: results,
        isAuth: isAuth,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'Todo App',
        isAuth: isAuth,
      });
    });
}) 

router.post('/', function(req, res, next){
  const todo = req.body.add;

  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  knex("tasks")
    .insert({user_id: userId, content: todo})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (error) {
      console.error(error);
      res.render('index', {
        title: 'Todo App',
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));


module.exports = router;
