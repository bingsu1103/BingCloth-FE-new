import axios from "./axios.customize";
const getOrderAPI = (id) => {
  const urlBackend = "/v1/api/order";
  return axios.get(urlBackend, {
    params: { userId: id },
  });
};

const getCurrentOrderAPI = (id) => {
  const urlBackend = "/v1/api/order-current";
  return axios.get(urlBackend, {
    params: { userId: id },
  });
};
const createOrderAPI = (type, data) => {
  const res = { type: type, ...data };
  const urlBackend = "/v1/api/order";
  return axios.post(urlBackend, res);
};
const updateOrderAPI = (data) => {
  const urlBackend = "/v1/api/order";
  return axios.put(urlBackend, data);
};
const deleteOrderAPI = (id) => {
  const urlBackend = "/v1/api/order";
  return axios.delete(urlBackend, {
    data: { id },
  });
};
export {
  getOrderAPI,
  createOrderAPI,
  deleteOrderAPI,
  updateOrderAPI,
  getCurrentOrderAPI,
};
