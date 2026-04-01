const express = require("express");
const mongoose = require('mongoose');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/tasksheets");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
});


//plan schema
const PlantSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  description: String
});


//rest api route
const Plant = mongoose.model("Plant", PlantSchema);
app.get('/api/plants', async (req, res) => {
const plants = await Plant.find({});
res.json({ statusCode: 200, data: plants, message: 'Success' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});