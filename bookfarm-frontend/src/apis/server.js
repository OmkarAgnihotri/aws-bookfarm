import axios from "axios";


const APIConfig = axios.create({
  baseURL: "https://devinsider.tech"
  
});

APIConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default APIConfig;
