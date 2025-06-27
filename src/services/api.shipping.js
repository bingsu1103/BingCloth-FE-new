import axios from "./axios.customize"
const createShippingAPI = (data) => {
    console.log(data);
    const { contact, first_name, last_name, unit, address, phone, country } = data;
    const name = `${first_name} ${last_name}`;
    const urlBackend = '/v1/api/shipping';
    return axios.post(urlBackend, { contact: contact, name: name, unit: unit, address: address, phone: phone, country: country });
}
export { createShippingAPI };