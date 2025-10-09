import axios from 'axios';

const API_URL = 'http://localhost:8081/api/licenses';

const getAll = () => {//calls the getAll method from the backend
    return axios.get(API_URL);
};

const get = id => {//calls the get method from the backend
    return axios.get(`${API_URL}/${id}`);
};

const create = data => {//calls POST method from the backend
    return axios.post(API_URL, data);
};

const update = (id, data) => {//calls PUT method from the backend
    return axios.put(`${API_URL}/${id}`, data);
};

const remove = id => {//calls DELETE method from the backend
    return axios.delete(`${API_URL}/${id}`);
};

// Additional methods for new functionality
const getAllLicenses = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const adjustApplicationFee = async (id, percentage) => {//allows the user to adjust the application fee
    const response = await axios.post(`${API_URL}/${id}/adjust-fee?percentage=${percentage}`, {}, {
        auth: {
            username: 'taku',//admin user
            password: 'password'
        }
    });
    return response.data;
};

const compareLicenses = async (id1, id2) => {//allows the user to compare two licenses
    const response = await axios.get(`${API_URL}/equals?a=${id1}&b=${id2}`, {
        auth: {
            username: 'taku',
            password: 'password'
        }
    });
    return response.data;
};

const getYearsBeforeExpiry = async (id) => {//allows the user to get the years before expiry
    const response = await axios.get(`${API_URL}/${id}/years-before-expiry`);
    return response.data;
};

const generateReport = async (format) => {//allows the user to generate a report 
    const response = await axios.get(`http://localhost:8081/api/reports/${format}`, {
        auth: {
            username: 'taku',
            password: 'password'
        },
        responseType: 'blob'
    });
    return response.data;//returns the report
};

const licenseService = {//object imported and used to fetch and manipulate the license data
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
