const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

dbconnect = () => {
  try {
    mongoose.connect(process.env.BOOKS_DATABASE_URL);
    console.log("database connected on books service");
  } catch (error) {
    console.log(error.message);
  }
};
dbconnect();
const books = require("./booksModels");
app.use(express.json());

port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("this is books library.");
});
//use insertmany too
app.post("/addbook", async (req, res) => {
  const { title, author, pages, price } = req.body;
  console.log(req.body);

  try {
    let result = await books.findOne({ title });
    if (result) {
      res.status(400).send({ message: "book already exist" });
    } else {
      await books.create({
        title,
        author,
        pages,
        price,
      });
      res.status(200).send({ message: "new book updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "server error" });
  }
});

app.delete("/deleteBook/:id", async (req, res) => {
  try {
    const result = await books.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send({ message: "book not found" });
    } else {
      res.status(200).send({ message: "book deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "server error" });
  }
});

app.get("/getBook/:id", async (req, res) => {
  result = await books.findById(req.params.id);
  try {
    if (result) {
      return res.status(200).send({ message: "this is your product", result });
    } else {
      return res.status(200).send({ message: "no product with this id" });
    }
  } catch (error) {
    console.log(error);
    return res.status(200).send({ message: "server error" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
