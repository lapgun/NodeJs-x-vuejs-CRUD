var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_todo'
});
dbConn.connect();
app.get('/blogs', function (req, res) {
    let where = '';
    let search = req.query.search;
    if (search) {
        where += ' Where name like "%' + search + '%"';

        dbConn.query('SELECT * FROM blogs ' + where, function (error, results, fields) {
            if (error) throw error;
            return res.send({
                error: false, data: results, message: 'users list.'
            });
        });
    }else {
        dbConn.query('SELECT * FROM  blogs', function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: 'users list.' });
        });
    }
});
app.get('/blog/:id', function (req, res) {
    let blog_id = req.params.id;
    if (!blog_id) {
        return res.status(400).send({error: true, message: 'please provide blog_id'})
    }
    dbConn.query('select * from blogs where id = ?', blog_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results[0], message: 'blog list'})
    })
});
app.post('/blog', function (req, res) {
    let blog = req.body;
    if (!blog) {
        return res.status(400).send({error: true, message: 'Please provide blog'});
    }

    dbConn.query("INSERT INTO blogs SET ? ", blog, function (error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results, message: 'New blog has been created successfully.'});
    });
});
app.put('/blog/:id', function (req, res) {

    let blog_id = req.body.id;
    let blog = req.body;
    let blog_name = req.body.name;
    let blog_author = req.body.author;
    if (!blog_id || !blog) {
        return res.status(400).send({error: blog, message: 'Please provide user and blog_id'});
    }

    dbConn.query("UPDATE blogs SET name = ? ,author = ? WHERE id = ?", [blog_name, blog_author, blog_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results, message: 'user has been updated successfully.'});
    });
});
app.delete('/blog/:id', function (req, res) {

    let blog_id = req.params.id;
    if (!blog_id) {
        return res.status(400).send({error: true, message: 'Please provide blog_id'});
    }
    dbConn.query('DELETE FROM blogs WHERE id = ?', blog_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({error: false, data: results, message: 'User has been updated successfully.'});
    });
});

app.listen(4000, function () {
    console.log('Node app is running on port 4  000');
});
module.exports = app;