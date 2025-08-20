import instance from "./axios.customize";
const askGemini = async (prompt) => {
  const urlBackend = "/v1/api/ask";
  return instance.post(urlBackend, { prompt });
};
export { askGemini };
