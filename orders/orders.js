const express = require("express");
const app = express();

const mongoose = require("mongoose");
app.use(express.json());
require('dotenv').config();

dbConfig = () => {
  try {
    mongoose.connect(process.env.ORDERS_DATABASE_URL);
    console.log("Connected to MongoDB orders db");
  } catch (error) {
    console.log("Error connecting to MongoDB orders db");
  }
};
dbConfig();
const orders = require("../orders/orderModel");
const axios = require("axios");
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/newOrder", async (req, res) => {
  let { customerId, bookId, borrowedDate, returnDate } = req.body;
  if (!customerId || !bookId || !borrowedDate || !returnDate) {
    return res.status(400).send({ message: "Please fill in all fields" });
  }
  try {
    const newOrder = {
      customerId,
      bookId,
      borrowedDate,
      returnDate,
    };
    const result = await orders.create(newOrder);
    res.status(200).json({ message: "order created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/getAllOrders", async (req, res) => {
  const result = await orders.find();
  try {
    if (ordersList.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    } else {
      res.status(404).json({ message: " orders found", result: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

app.get("/orderByName/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerId = order.customerId;
    const bookId = order.bookId;

    const customerResponse = await axios.get(
      `http://localhost:7000/getCustomer/${customerId}`
    );
    console.log("Customer Response:", customerResponse.data); // Log customer response
    const customer = customerResponse.data;

    const bookResponse = await axios.get(
      `http://localhost:5000/getBook/${bookId}`
    );
    console.log("Book Response:", bookResponse.data); // Log book response
    const book = bookResponse.data;

    res.status(200).json({
      message: "Order, customer name, and book name found",
      order: {
        _id: order._id,
        customerId: order.customerId,
        customerName: customer.name, // Assuming the response has 'name' field
        bookId: order.bookId,
        bookName: book.title, // Assuming the response has 'title' field
        borrowedDate: order.borrowedDate,
        returnDate: order.returnDate,
        bookrespo: bookResponse.data,
        customerRespo: customerResponse.data,
      },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/deleteOrder/:id", async (req, res) => {
  const orderId = req.params.id;
  const result = await orders.findById(orderId);
  try {
    if (!result) {
      return res
        .status(404)
        .json({ message: "Order not found enter valid id" });
    } else {
      let del = await orders.findByIdAndDelete(orderId);
      res
        .status(200)
        .json({ message: "Order deleted successfully", deletedorder: del });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
