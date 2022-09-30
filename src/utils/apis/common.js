import axios from 'axios';

export const instance = axios.create({
  timeout: 5000,
});

instance.defaults.baseURL = process.env.REACT_APP_API_URL;
instance.interceptors.response.use(onFulfilled, onRejected);

function onFulfilled(response) {
  return response;
}

function onRejected(error) {
  const code = error.code;
  const status = error.response?.status;
  if (code === 'ECONNABORTED' || status === 408) {
    alert('요청이 만료되었습니다.');
  }
  return Promise.reject(error);
}

const request = async (config) => {
  return instance(config);
};

export default request;
