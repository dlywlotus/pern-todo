import express from "express";
import pool from "../db.js";
import { getDateTime } from "../util.js";

const router = express.Router();

//Create
const createTask = async (req, res) => {
  try {
    const { description } = req.body;
    const newTask = await pool.query(
      "INSERT INTO todo (description, data_time) VALUES($1, $2) RETURNING *",
      [description, getDateTime()]
    );
    res.json(newTask.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

//Read
const getTasks = async (_, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
    res.json(allTodos.rows);
  } catch (error) {
    console.log(error.message);
  }
};
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows);
  } catch (error) {
    console.log(error.message);
  }
};

//Update
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedTask = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
      [description, id]
    );
    res.json(updatedTask.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};
//Delete
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const remainingTasks = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    res.json(remainingTasks.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
};

//Create
router.post("/task", createTask);

//Read
router.get("/tasks", getTasks);
router.get("/task/:id", getTask);

//Update
router.put("/task/:id", updateTask);

//Delete
router.delete("/task/:id", deleteTask);

export default router;
