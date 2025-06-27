import axios from "./axios.customize"
const createPaymentAPI = (data) => {
    const urlBackend = "/v1/api/payment";
    const { method } = data;
    return axios.post(urlBackend, { method: method })
}
export { createPaymentAPI };