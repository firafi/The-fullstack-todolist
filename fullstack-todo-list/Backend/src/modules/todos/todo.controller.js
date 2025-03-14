import TodoModel from "../../../DB/models/Todo.model.js";

export const getTodos = async (req, res) => {
  const { page = 1, limit = 3, title = "" } = req.query;

  try {

    const totalCount = await TodoModel.countDocuments({
      //title: { $regex: title, $options: "i" },
    });

    const numOfPages = Math.ceil(totalCount / limit);

    const todos = await TodoModel.find(
      {
        title: { $regex: title, $options: "i" },
      },
      {},
      { skip: (Math.min(page, numOfPages) - 1) * limit, limit }
    );

    return res.status(200).json({ todos, numOfPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addTodo = async (req, res) => {
  const { title, description } = req.body;

  try {
    const todo = await TodoModel.create({
      title,
      description,
    });

    return res.status(201).json({ todo });
  } catch (error) {
    if (error.errors.title)
      return res.status(400).json({ message: "the Title field is required" });

    if (error.errors.description)
      return res
        .status(400)
        .json({ message: "the Description field is required" });

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await TodoModel.deleteOne({ _id: id });
    if (deletedTodo.deletedCount == 0)
      return res.status(404).json({ message: "No such Todo with this id" });
    return res.status(204).json();
  } catch (error) {
    if (error.kind === "ObjectId")
      return res
        .status(404)
        .json({ message: "id is not compatable with ObjectId format" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  try {
    // Find the todo by _id and update the isCompleted field
    const updatedNote = await TodoModel.findOneAndUpdate(
      { _id: id }, // Match by the _id from params
      { isCompleted }, // Update the isCompleted field
      { new: true } // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "No such Todo with this id" });
    }

    // Return the updated note (todo)
    return res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

