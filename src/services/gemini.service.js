import axios from "./axios.customize"
const askGemini = async (prompt) => {
    const urlBackend = "/v1/api/ask";
    return axios.post(urlBackend, { prompt })
}
export { askGemini };