import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "http://localhost:8080/api";

export const useAxios = (axiosParams) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState([]);

  const fetchData = (params) => {
    axios.request(params)
      .then((res) => {
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
    fetchData(axiosParams);
  }, []);

  return { response, error, loading };
};
