import { useState } from "react";
import { CustomErrorAlert } from "../utils/general.js";

const useGetTodos = (setTodos, setNumOfPages, setPage) => {
  const [isLoading, setIsLoading] = useState(true);


  const fetchTodos = async (page, limit) => {
    setIsLoading(true); // Start loading before fetching
    
    try {
      const response = await fetch(`http://localhost:4000/api/todos?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      console.log("Fetched todos using fetch:", data);  // Log response to check
      
      if (!data || !data.todos) throw new Error('Invalid data format'); // Ensure data structure
      setTodos(data.todos);
      setNumOfPages(data.numOfPages);
      if (page > data.numOfPages) setPage(data.numOfPages);
    } catch (error) {
      console.error("Fetch error:", error);
      CustomErrorAlert(error);
    }
    finally {
      setIsLoading(false);
    }
  };
  

/*   const fetchTodos = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/todos?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setTodos(data.todos);
      setNumOfPages(data.numOfPages);
      if (page > data.numOfPages) setPage(data.numOfPages);
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  }; */

  return { fetchTodos, isFetchingTodos: isLoading };
};

export default useGetTodos;
