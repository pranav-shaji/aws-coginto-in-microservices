const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const validate = require("../validation/validate");
require('dotenv').config();
const port = process.env.PORT;


dbConnect = () => {
  try {
    mongoose.connect(process.env.CUSTOMERS_DATABASE_URL);
    console.log("Connected to MongoDB customers");
  } catch (error) {
    console.log("error", error);
  }
};
dbConnect();
customers = require("../customers/customerModel");

app.get("/", (req, res) => {
  res.send("Hello from customer module");
});

app.post("/createCustomer", async (req, res) => {
  const { email, password, age, address } = req.body;
  if (!email || !password || !age || !address) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Find if customer already exists
    const existingCustomer = await customers.findOne({ email });

    if (existingCustomer) {
      // Customer already exists
      return res.status(409).json({ message: "Customer already exists" });
    } else {
      const hashedPassword = await argon.hash(password);

      // Create new customer
      const newCustomer = await customers.create({
        email,
        password: hashedPassword,
        age,
        address,
      });
      res
        .status(201)
        .json({ message: "Customer created successfully", data: newCustomer });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/signIn", async (req, res) => {
  const { email, password } = req.body;
  const existingCustomer = await customers.findOne({ email });
  try {
    if (!existingCustomer) {
      res.status(400).json({ message: "customer not registerd please signup" });
    } else {
      const Isvalid = await argon.verify(existingCustomer.password, password);
      if (!Isvalid) {
        res.status(400).json({ message: "Invalid password" });
      } else {
        const token = jwt.sign(
          { id: existingCustomer._id, email: existingCustomer.email },
          "123",
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Sign-in successful", token });
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getCustomer/:id",validate, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }
  const result = await customers.findById(id);
  try {
    if (result) {
      res.status(200).json({ message: "Customer found", data: result });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getAllCustomers",validate, async (req, res) => {
  result = await customers.find();
  console.log(result);

  try {
    if (result) {
      res.status(200).json({ message: "Customers found", data: result });
    } else {
      res.status(404).json({ message: "Customers not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/DeleteCustomer/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ivalid id" });
  }
  try {
    const result = await customers.findByIdAndDelete(id);
    if (result) {
      res
        .status(200)
        .json({ message: "customer deleted", deleted_customer: result });
    } else {
      res.status(200).json({ message: "customer not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
