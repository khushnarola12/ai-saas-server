const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./mongodb/connect.js");
const postRoutes = require("./routes/postRoutes.js");
const dalleRoutes = require("./routes/dalleRoutes.js");

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

app.get("/", async (req, res) => {
  res.send("Hello from DALL-E");
});

const startServer = async () => {
  try {
    connectDB("mongodb://localhost:27017/dall-e");
    app.listen(8080, () =>
      console.log("server has started on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();