// src/server.ts
import express from "express";
import chatRouter from "./routes/chat";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

// Mount the chat route.
app.use("/chat", chatRouter);

// A simple root endpoint.
app.get("/", (req, res) => {
  res.send("WAaaS Server is running.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});