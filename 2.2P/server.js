//import express
const express = require('express');
const path = require('path');
//create express app
const app = express();

//set port; this make run on localhost:3000
const PORT = process.env.PORT || 3000;

//serve static files from the public flder
app.use(express.static(path.join(__dirname, 'public')));
//gET endpoint to add two numbers like localhost:3000/add?a=5&b=7
app.get('/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.send("provide valid number only !!");
  }

  const sum = a + b;
  res.send(`The sum of ${a} and ${b} is: ${sum}`);
});

//rest similar to add
app.get('/subtract', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.send("provide valid number only !!");
  }

  const difference = a - b;
  res.send(`The difference of ${a} and ${b} is: ${difference}`);
});

app.get('/product', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.send("provide valid number only !!");
  }

  const product = a * b;
  res.send(`The product of ${a} and ${b} is: ${product}`);
});

app.get('/division', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.send("provide valid number only !!");
  }

  //check for division by zero
  if (b === 0) {
    return res.send("Cannot divide by zero");
  }

  const division = a / b;
  res.send(`The division of ${a} and ${b} is: ${division}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});