const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userwithsameusername = users.filter(user => user.username === username);
  if(userwithsameusername.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validuser = users.filter(user => user.username === username && user.password === password);
  if(validuser.length > 0){
    return true;
  } else {
    return false;
  }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username or password missing"});
  }
  if(username && password){
    if(authenticatedUser(username,password)){
      let token = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
      req.session.autorization = {accessToken: token, username: username};
      return res.status(200).json({message: "User logged in successfully"});
    }
  }
  return res.status(400).json({message: "Invalid username or password"});
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const {review} = req.body;
  if(!review){
    return res.status(400).json({message: "Review not provided"});
  }
  if(!req.session.autorization){
    return res.status(400).json({message: "User not logged in"});
  }
  let token = req.session.autorization['accessToken'];
  jwt.verify(token, 'access', (err, user) => {
    if (!err) {
      const username = req.session.autorization['username'];
      books[isbn].reviews[username] = review;
      return res.status(200).json({message: "Review added successfully"});
    } else {
      return res.status(403).json({message: "User not authenticated"});
    }
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  if(!req.session.autorization){
    return res.status(400).json({message: "User not logged in"});
  }
  let token = req.session.autorization['accessToken'];
  jwt.verify(token, 'access', (err, user) => {
    if (!err) {
      const username = req.session.autorization['username'];
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(403).json({message: "User not authenticated"});
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
