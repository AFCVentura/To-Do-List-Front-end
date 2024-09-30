import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "http://localhost:8080/api";

export const useAxios = (params) => {
  const [axiosParams, setAxiosParams] = useState(params || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState([]);

  const fetchData = () => {
    axios
      .request(axiosParams)
      .then((res) => {
        console.log("response: ", res.data);
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!axiosParams) {
      return;
    }
    console.log("request: ", axiosParams);
    fetchData();
  }, [axiosParams]);

  return [{ response, error, loading }, setAxiosParams];
};
