const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const jsonWebToken = require('jsonwebtoken');
const app = express();
const routes = require('./src/route/routes');
const connectDb = require('./src/dbconnection/db');
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);

connectDb();
app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
    
});