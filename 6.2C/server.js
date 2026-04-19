//import express
const express = require('express');
const path = require('path');
const { add, subtract, multiply, divide } = require("./calculator");
//create express app
const app = express();

//set port; this make run on localhost:3000
const PORT = process.env.PORT || 3000;

//serve static files from the public flder
app.use(express.static(path.join(__dirname, 'public')));
//gET endpoint to add two numbers like localhost:3000/add?a=5&b=7
app.get("/add", (req, res) => {
  try {
    const result = add(req.query.a, req.query.b);
    res.status(200).send(`The sum of ${req.query.a} and ${req.query.b} is: ${result}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/subtract", (req, res) => {
  try {
    const result = subtract(req.query.a, req.query.b);
    res.status(200).send(`The difference of ${req.query.a} and ${req.query.b} is: ${result}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/product", (req, res) => {
  try {
    const result = multiply(req.query.a, req.query.b);
    res.status(200).send(`The product of ${req.query.a} and ${req.query.b} is: ${result}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/division", (req, res) => {
  try {
    const result = divide(req.query.a, req.query.b);
    res.status(200).send(`The division of ${req.query.a} and ${req.query.b} is: ${result}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;