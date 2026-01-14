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
public_users.get('/', async function(req, res) {
    try {
        const response = await axios.get("http://localhost:5000/");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({message: "Book not found", error: error.message});
    }
});


public_users.get('/author/:author', async function (req, res) {
    let author = req.params.author

    let isbn = req.params.isbn
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({message: "Author not found", error: error.message});
    }
})

public_users.get('/title/:title', async function (req, res) {
    let title = req.params.title
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({message: "Title not found", error: error.message});
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
