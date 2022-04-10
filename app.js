const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const port = 8000;
const app = express();
app.use(bodyParser.json());

const books = [
  {
    author: "JK Rowling",
    books: "Harry Potter",
  },
  {
    author: "Tolkien",
    books: "Lord of the Rings",
  },
  {
    author: "Stephanie Meyer",
    books: "Twilight",
  },
];

const users = [
  {
      username: 'terra',
      password: 'password123admin',
      role: 'admin'
  }, {
      username: 'dave',
      password: 'password123member',
      role: 'member'
  }
];

const accessTokenSecret = "pintuAjaibDoraemon5680";

app.post("/login", (req, res) => {
  // untuk membaca input body dari user
  const { username, password } = req.body;

  // filter untuk cari user dari array users
  const user = users.find((user) => {
    return user.username === username && user.password === password;
  });

  // generate token
  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("ini authheader", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("ini token", token);
    jwt.verify(token, accessTokenSecret, (error, user) => {
      if (error) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.get("/", authenticateJWT, (req, res) => {
  const { role } = req.user;
  console.log("req", req.user);
  if (role === "admin") {
    res.json(books);
  } else {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`Listen to ${port}`);
});
