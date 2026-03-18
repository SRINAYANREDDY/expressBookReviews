const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10 - Get all books using async-await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

  // Task 11 - Get book by ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error fetching book", error: error.message });
    }
  });

  // Task 12 - Get book by author using async-await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

  // Task 13 - Get book by title using async-await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }
  const userAlreadyExists = users.filter((user) => user.username === username);
  if (userAlreadyExists.length > 0) {
    return res.status(404).json({ message: "Username already exists!" });
  }
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  });
  res.send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  });
  res.send(JSON.stringify(matchingBooks, null, 4));
});
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;

