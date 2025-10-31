const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try {
    res.status(200).json(JSON.stringify(books));
  } catch(error) {
    res.status(500).json({message: "Error retrieving books list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matched = [];

    for (let k of keys) {
      if (books[k].author && books[k].author.toLowerCase() === author.toLowerCase()) {
        // include isbn in the returned object
        matched.push({ isbn: k, ...books[k] });
      }
    }

    if (matched.length > 0) {
      return res.status(200).json(matched);
    } else {
      return res.status(404).json({ message: "No books found for the given author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    const title = req.params.title;
    const keys = Object.keys(books);
    const matched = [];

    for (let k of keys) {
      if (books[k].title && books[k].title.toLowerCase() === title.toLowerCase()) {
        matched.push({ isbn: k, ...books[k] });
      }
    }

    if (matched.length > 0) {
      return res.status(200).json(matched);
    } else {
      return res.status(404).json({ message: "No books found for the given title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
