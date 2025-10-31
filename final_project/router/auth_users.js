const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // a simple validation: username should be a non-empty string
  return typeof username === 'string' && username.trim().length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // create JWT token and save in session
  const accessToken = jwt.sign({ username: username }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!req.session || !req.session.authorization) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.username;

    if (!review) {
      return res.status(400).json({ message: "Review text is required (use ?review=your+text)" });
    }

    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // add or update the review for this user
    if (!book.reviews) book.reviews = {};
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
  } catch (error) {
    return res.status(500).json({ message: "Error adding/updating review" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;

    if (!req.session || !req.session.authorization) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const username = req.session.authorization.username;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review by user not found" });
    }

    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
