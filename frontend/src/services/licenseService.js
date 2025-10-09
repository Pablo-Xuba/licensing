import axios from 'axios';

const API_URL = 'http://localhost:8081/api/licenses';

// Helper function to get auth headers from localStorage
const getAuthHeaders = () => {
    const credentials = localStorage.getItem('authCredentials');
    if (credentials) {
        const { username, password } = JSON.parse(credentials);
        return {
            auth: {
                username: username,
                password: password
            }
        };
    }
    return {};
};

const getAll = () => {
    return axios.get(API_URL, getAuthHeaders());
};

const get = id => {
    return axios.get(`${API_URL}/${id}`, getAuthHeaders());
};

const create = data => {
    return axios.post(API_URL, data, getAuthHeaders());
};

const update = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
};

const remove = id => {
    return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};

// Additional methods for new functionality
const getAllLicenses = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

const adjustApplicationFee = async (id, percentage) => {
    const response = await axios.post(`${API_URL}/${id}/adjust-fee?percentage=${percentage}`, {}, getAuthHeaders());
    return response.data;
};

const compareLicenses = async (id1, id2) => {
    const response = await axios.get(`${API_URL}/equals?a=${id1}&b=${id2}`, getAuthHeaders());
    return response.data;
};

const getYearsBeforeExpiry = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/years-before-expiry`, getAuthHeaders());
    return response.data;
};

const generateReport = async (format) => {//allows the user to generate a report 
    const response = await axios.get(`http://localhost:8081/api/reports/${format}`, {
        ...getAuthHeaders(),
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
