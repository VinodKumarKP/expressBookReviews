const express = require('express');
const axios = require('axios');
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
            res.send(`Customer successfully registred. Now you can login`)
        } else {
            res.send(`User ${username} already exists`)
        }
    } else {
        res.send("Both user name and password need to be provided")
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        if (books[isbn]) {
            res.status(200).json(books[isbn]);
        } else {
            res.status(404).json({message: "Book not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching book", error: error.message});
    }
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        const booksByAuthor = Object.values(books).filter((book) => book.author === author);
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({message: "Author not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching books", error: error.message});
    }
});

public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title;
    try {
        const response = await axios.get("http://localhost:5000/");
        const books = response.data;
        const booksByTitle = Object.values(books).filter((book) => book.title === title);
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({message: "Title not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching books", error: error.message});
    }
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (books[isbn]) {
        res.send(books[isbn].reviews)
    }
});

module.exports.general = public_users;
