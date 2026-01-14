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
    //Write your code here
    new Promise((resolve, reject) => {
        resolve({ "books": Object.values(books) });
    }).then((data) => res.send(data));
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


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({status: 404, message: `Book with ISBN ${isbn} not found`});
        }
    }).then(data => res.send(data)).catch(err => res.status(err.status).json({message: err.message}));

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

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author

    //Obtain all the keys for the 'books' object.
    let keys = Object.keys(books)

    let filtered_authors = []

    new Promise((resolve, reject) => {
        //Iterate through the 'books' array & check the author matches the one provided in the request parameters.
        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].author.toLowerCase() === author.toLowerCase()) {
                //Append the books to an array
                filtered_authors.push(books[keys[i]]);
            }
        }
        if (filtered_authors.length > 0) {
            resolve({"booksbyauthor": filtered_authors});
        } else {
            reject({status: 404, message: `No books found for author ${author}`});
        }
    }).then((data) => res.send(data)).catch(err => res.status(err.status).json({message: err.message}));
    // res.send(filtered_authors)
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

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title

    new Promise((resolve, reject) => {
        let keys = Object.keys(books)
        let filtered_titles = []

        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].title.toLowerCase() === title.toLowerCase()) {
                filtered_titles.push(books[keys[i]])
            }
        }
        if (filtered_titles.length > 0) {
            resolve({"booksbytitle": filtered_titles});
        } else {
            reject({status: 404, message: `Book with title ${title} not found`});
        }
    }).then((data) => res.send(data)).catch(err => res.status(err.status).json({message: err.message}));
});

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
