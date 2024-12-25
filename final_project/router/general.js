const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooksWithAsyncAwait = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookWithISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookWithAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookWithTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



//register a user
public_users.post("/register", (req,res) => {
  const {username, password} = req.body;

  if(username && password){
    if(!isValid(username)){
      users.push({username, password});
      return res.status(200).json({message: "User registered successfully"});
    } else {
      return res.status(400).json({message: "User already exists"});
    }
  } else {
    return res.status(400).json({message: "Invalid username or password"});
  }
}
);

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const book_details = [];
  for (let i in books){
    if(books[i].author === author){
      book_details.push(books[i]);
    }
  }
  return res.send(JSON.stringify(book_details));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book_details = [];
  for (let i in books){
    if(books[i].title === title){
      book_details.push(books[i]);
    }
  }
  return res.send(JSON.stringify(book_details));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
