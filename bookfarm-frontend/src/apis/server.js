import axios from "axios";


const APIConfig = axios.create({
  baseURL: "http://bookfarm-dev-env.eba-beaukv92.ap-south-1.elasticbeanstalk.com"
  // baseURL: "http://localhost:8000",
  // baseURL: "http://backend-nodejs2-dev.us-east-1.elasticbeanstalk.com",
  // baseURL: " https://boiling-harbor-93827.herokuapp.com",
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
