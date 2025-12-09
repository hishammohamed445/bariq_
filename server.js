require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const apiRouter = require("./src/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "frontend")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
