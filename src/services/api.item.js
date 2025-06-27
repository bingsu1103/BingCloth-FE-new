import axios from "./axios.customize"
const getItemAPI = () => {
    const urlBackend = "/v1/api/item";
    return axios.get(urlBackend);
}
const createItemAPI = (data) => {
    const urlBackend = "/v1/api/item";
    return axios.post(urlBackend, data);
}
const updateItemAPI = (data) => {
    const urlBackend = "/v1/api/item";
    return axios.put(urlBackend, data);
}
const deleteItemAPI = (id) => {
    const urlBackend = "/v1/api/item";
    return axios.delete(urlBackend, {
        data: { id }
    })
}
export {
    getItemAPI, createItemAPI, updateItemAPI, deleteItemAPI
}