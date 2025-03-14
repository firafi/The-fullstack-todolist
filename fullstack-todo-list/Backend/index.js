import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/modules/todos/todo.router.js";

const app = express();
const PORT = 4000;

app.use(express.json());

app.use(express.urlencoded({extended: true }));

// Use CORS Middleware
app.use(cors({
  origin: 'http://localhost:8000',  // Allow requests from frontend
  allowedHeaders: ['Content-Type'] // Allowed headers
}));

app.use("/api/todos", router); // Mounts the route correctly
const MONGO_URI ='mongodb://mongodb:27017';
const dbname = 'todos';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbname })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, default: 18 },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, },
  date: { type: String, },
  activity: { type: String, },
  description: { type: String, },
  strStatus: { type: String, }
});



const User = mongoose.model('User', userSchema);
const Todos = mongoose.model('Todos', todoSchema);

// Route: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route: Fetch all users
app.post('/api/todos', async (req, res) => {
  const { title, description, activity, date, strStatus } = req.body;

  try {
    const todo = new Todos({
      title,
      description,
      activity,
      date,
      strStatus
    });
    await todo.save();

    return res.status(201).send({ todo });
  } catch (error) {

    console.log(error);
    return res.status(500).send({ message: error });
  }
});

app.get('/api/todos', async (req, res) => {
  try {
    // Fetch todos from the database or static data
    const todos = await Todos.find(); // Replace with actual DB query logic
    console.log("Todos fetched:", todos); // Log data for debugging
    res.json({ todos: todos });
  } catch (error) {
    console.error("Error fetching todos:", error); // Log errors if any
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});



// Route: Fetch all todos
app.get('/api/todos', async (req, res) => {

  try {

    const todoList = await Todos.find();

    return res.status(201).send({ todoList });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error });
  }
});

// Routes
app.get('/', async (req, res) => {
  try {
    //const Todo = await TodoModel.find();
    res.send("Todo");
  }
  catch (e) {
    console.log(e);
  }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

