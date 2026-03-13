const express = require("express");
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Clean Code",                 author: "Robert Martin" },
  { id: 2, title: "Introduction to Algorithms", author: "CLRS"          },
];

// GET /books — View all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET /books/:id — View a single book
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

// POST /books — Add a new book
app.post("/books", (req, res) => {
  const { id, title, author } = req.body;
  if (!id || !title || !author) {
    return res.status(400).send("Invalid Request: id, title, and author are required");
  }
  const newBook = { id, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id — Update title or author
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");
  const { title, author } = req.body;
  if (!title && !author) {
    return res.status(400).send("Invalid Request: provide at least title or author to update");
  }
  if (title)  book.title  = title;
  if (author) book.author = author;
  res.json(book);
});

// DELETE /books/:id — Remove a book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("Book not found");
  books.splice(index, 1);
  res.send("Book deleted successfully");
});

const PORT = 3007;
app.listen(PORT, () => console.log(`Task 7 running on http://localhost:${PORT}`));
