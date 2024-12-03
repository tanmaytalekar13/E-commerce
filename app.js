require("dotenv").config();

const express = require('express');
const app = express();
const cors=require('cors');
app.use(cors());
const connectDB = require('./config/mongodb');
const indexRoutes = require("./routes/index.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes=require("./routes/products.routes");

// Connect to the database
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use('/product',productRoutes);


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
