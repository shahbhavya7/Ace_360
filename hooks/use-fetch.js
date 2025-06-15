import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => { // Custom hook to handle fetching data with loading and error states
    // cb is a callback function that performs the fetch operation, it is present in the form of an async function in components
  const [data, setData] = useState(undefined); // State to hold the fetched data maybe undefined initially
  const [loading, setLoading] = useState(null); // State to track loading status, initially set to null , this is used to show a loading spinner or similar UI element while the data is being fetched
  const [error, setError] = useState(null); // State to hold any error that occurs during the fetch operation, initially set to null

  const fn = async (...args) => { // Function to execute the fetch operation with extra arguments, this function can be called with any number of arguments, which will be passed to the callback function (cb) when it is invoked
    setLoading(true); // Set loading to true to indicate that a fetch operation is in progress
    setError(null); // Reset error state to null before starting a new fetch operation

    try {
      const response = await cb(...args); // Call the callback function (cb) with the provided arguments, the arguments can be any parameters sent by fn functions
      // the arguments can be used to pass data to the callback function, such as user input or other parameters needed for the fetch operation
      setData(response); // Set the values returned by callback i.e. updateUser to data state variable
      setError(null); // Reset error state to null if the fetch operation is successful
    } catch (error) {
      setError(error); // Set the error state to the caught error, this allows the component using this hook to handle the error appropriately
      toast.error(error.message);
    } finally {
      setLoading(false); // Set loading to false to indicate that the fetch operation has completed, regardless of whether it was successful or resulted in an error
    }
  };

  return { data, loading, error, fn, setData }; // Return an object containing the fetched data, loading status, error status, the fetch function (fn), and a function to set the data (setData)
}; // this object is sent takes data from onboarding-form.jsx and sends it to the updateUser function in actions/user.js

export default useFetch;
