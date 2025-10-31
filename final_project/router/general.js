const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // check if username already exists
    const exists = users.find(u => u.username === username);
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
});

// Get the book list available in the shop
// internal lightweight endpoint returning books data (used by async/axios example)
public_users.get('/books-data', function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books data" });
  }
});

// Get the book list available in the shop (Task 10) - using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    // call the internal endpoint with axios to demonstrate async/await
    const response = await axios.get('http://localhost:5000/books-data');
    // response.data already contains the books object
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books list" });
  }
});

// Get book details based on ISBN
// internal endpoint to return a single book (used by async/axios example)
public_users.get('/books-data/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book data" });
  }
});

// Get book details based on ISBN (Task 11) - using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books-data/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// internal endpoint returning books by author (used by async/axios example)
public_users.get('/books-data/author/:author', function (req, res) {
  try {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matched = [];

    for (let k of keys) {
      if (books[k].author && books[k].author.toLowerCase() === author.toLowerCase()) {
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

// Get book details based on author (Task 12) - using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/books-data/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for the given author" });
    }
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

// Get book details based on Title (Task 13) - using async/await with Axios
public_users.get('/async-title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for the given title" });
    }
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book reviews" });
  }
});

module.exports.general = public_users;
