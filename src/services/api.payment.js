import axios from "./axios.customize";
const createPaymentAPI = (data) => {
  const urlBackend = "/v1/api/payment";
  const { method } = data;
  return axios.post(urlBackend, { method: method });
};
const updatePaymentAPI = (id) => {
  const urlBackend = "/v1/api/payment";
  return axios.put(urlBackend, { id, status: "paid" });
};
export { createPaymentAPI, updatePaymentAPI };
