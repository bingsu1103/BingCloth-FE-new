import axios from "./axios.customize";
const createPaymentOnline = (data) => {
    const urlBackend = "/v1/api/momo-create";
    return axios.post(urlBackend, data);
}
export { createPaymentOnline }