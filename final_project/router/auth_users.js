const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username exists in users array
  let validUsers = users.filter((user) => user.username === username);
  return validUsers.length > 0;
};

const authenticatedUser = (username, password) => {
  // Check if username and password match
  let validUsers = users.filter((user) => 
    user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

// Login route
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  // Use authenticatedUser function to validate
  if (!authenticatedUser(username, password)) {
    return res.status(404).json({ message: "Invalid username or password" });
  }

  // Generate JWT token and save to session
  let accessToken = jwt.sign({ username: username }, "access", { expiresIn: "1h" });
  req.session.authorization = { accessToken };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: `Review for ISBN ${isbn} posted/updated successfully`,
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: `Review by ${username} for ISBN ${isbn} deleted successfully`
      });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;