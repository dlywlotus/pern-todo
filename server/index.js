import express from "express";
import cors from "cors";
import taskRoutes from "./routes/task.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.get("/", (_, res) => res.send("This is an express app"));
app.all("*", (_, res) => res.send("Route does not exist"));

app.listen(PORT, () =>
  console.log(`Server is listening on http://localhost/${PORT}`)
);
