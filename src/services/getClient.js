import axios from 'axios';

const getClient = axios.create({
  baseURL: 'https://terraresta.com/app/api',
});

getClient.interceptors.request.use(
  async config => {
    config.headers.Accept = 'application/json';
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

export default getClient;
