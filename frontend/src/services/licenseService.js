import axios from 'axios';

const API_URL = 'http://localhost:8081/api/licenses';

const getAll = () => {
    return axios.get(API_URL);
};

const get = id => {
    return axios.get(`${API_URL}/${id}`);
};

const create = data => {
    return axios.post(API_URL, data);
};

const update = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data);
};

const remove = id => {
    return axios.delete(`${API_URL}/${id}`);
};

// Additional methods for new functionality
const getAllLicenses = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const adjustApplicationFee = async (id, percentage) => {
    const response = await axios.post(`${API_URL}/${id}/adjust-fee?percentage=${percentage}`, {}, {
        auth: {
            username: 'taku',
            password: 'password'
        }
    });
    return response.data;
};

const compareLicenses = async (id1, id2) => {
    const response = await axios.get(`${API_URL}/equals?a=${id1}&b=${id2}`, {
        auth: {
            username: 'taku',
            password: 'password'
        }
    });
    return response.data;
};

const getYearsBeforeExpiry = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/years-before-expiry`);
    return response.data;
};

const generateReport = async (format) => {
    const response = await axios.get(`http://localhost:8081/api/reports/${format}`, {
        auth: {
            username: 'taku',
            password: 'password'
        },
        responseType: 'blob'
    });
    return response.data;
};

const licenseService = {
    getAll,
    get,
    create,
    update,
    remove,
    getAllLicenses,
    adjustApplicationFee,
    compareLicenses,
    getYearsBeforeExpiry,
    generateReport
};

export default licenseService;
