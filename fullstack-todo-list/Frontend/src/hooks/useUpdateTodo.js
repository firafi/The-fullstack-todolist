import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useUpdateTodo = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateTodo = async (todo) => {
    console.log("Updating todo:", todo);

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/todos/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted: !todo.isCompleted }),
        }
      );

      const responseText = await response.text(); // Get raw response
      console.log("Response:", response.status, responseText);
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item._id === todo._id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : item
        )
      );
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isUpdatingTodo: isLoading };
};

export default useUpdateTodo;
