const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
    return !!users[username];
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    if (isValid(username)) {
        return users[username] === password;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }

    if (!authenticatedUser(user.name, user.password)) {
        return res.status(401).json({message: `Invalid credentials or User ${user.name} does not exists`});
    }

    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', {expiresIn: 60 * 60});
    // Store access token in session
    req.session.authorization = {
        accessToken
    }

    req.session.user = user;

    return res.status(200).send("User successfully logged in");


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted.
    // If the same user posts a different review on the same ISBN, it should modify the existing review.
    // If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
    const isbn = req.params.isbn
    if (books[isbn]) {
        const reviews = books[isbn].reviews
        reviews[req.session.user.name] = req.body.review
        books[isbn].reviews = reviews
        res.send(`Successfully added/updated the review for the book with ISBN ${isbn}`)
    } else {
        res.send(`Book with ISBN ${isbn} does not exist`)
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users.
    const isbn = req.params.isbn
    if (books[isbn]) {
        const reviews = books[isbn].reviews
        if (reviews[req.session.user.name]) {
            delete reviews[req.session.user.name]
            books[isbn].reviews = reviews
            res.send(`Successfully deleted the review for the book with ISBN ${isbn}`)
        } else {
            res.send(`No review found for the book with ISBN ${isbn} for the user ${req.session.user.name}`)
        }
    }
    else {
        res.send(`Book with ISBN ${isbn} does not exist`)
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
