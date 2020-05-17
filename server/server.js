const express = require("express");
const cors = require("cors");
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure routes
app.use("/evaluate", require("./routes/evaluate"));

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));