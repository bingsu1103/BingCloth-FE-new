import axios from './axios.customize'
const getProductAPI = () => {
    const urlBackend = "/v1/api/product";
    return axios.get(urlBackend)
}
const getAProductAPI = (id) => {
    const urlBackend = `/v1/api/product/${id}`;
    return axios.get(urlBackend);
}
const createProductAPI = (data) => {
    const urlBackend = "/v1/api/product";
    return axios.post(urlBackend, data);
}
const updateProductAPI = (data) => {
    const urlBackend = "/v1/api/product";
    return axios.put(urlBackend, data);
}
const uploadProductImageAPI = (file) => {
    const urlBackend = "/v1/api/upload/product-img";
    const formData = new FormData();
    formData.append("image", file);
    return axios.post(urlBackend, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
}
const deleteProductAPI = (id) => {
    const urlBackend = `/v1/api/product`;
    return axios.delete(urlBackend, {
        data: { id }
    }
    );
}
export { getAProductAPI, getProductAPI, uploadProductImageAPI, createProductAPI, deleteProductAPI, updateProductAPI }