const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }

    //If the username already exists, it must mention the same & must also show other errors like
    // eg. when username & password are not provided.
    const username = user.name
    const password = user.password
    if (username && password) {
        if (!users[username]) {
            users[username] = password;
            res.send(`Successfully registered the user ${username}`)
        } else {
            res.send(`User ${username} already exists`)
        }
    } else {
        res.send("Both user name and password need to be provided")
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn

    if (books[isbn]) {
        res.send(books[isbn])
    }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author

    //Obtain all the keys for the 'books' object.
    let keys = Object.keys(books)

    let filtered_authors = []

    //Iterate through the 'books' array & check the author matches the one provided in the request parameters.
    for (let i = 0; i < keys.length; i++) {
        if (books[keys[i]].author.toLowerCase() === author.toLowerCase()) {
            //Append the books to an array
            filtered_authors.push(books[keys[i]]);
        }
    }
    res.send(filtered_authors)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title
    let keys = Object.keys(books)
    let filtered_titles = []

    for (let i = 0; i < keys.length; i++) {
        if (books[keys[i]].title.toLowerCase() === title.toLowerCase()) {
            res.send(books[keys[i]])
        }
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (books[isbn]) {
        res.send(books[isbn].reviews)
    }
});

module.exports.general = public_users;
