import axios from "./axios.customize"
const getCategoryAPI = () => {
    const urlBackend = "/v1/api/category";
    return axios.get(urlBackend);
}
export {
    getCategoryAPI
}