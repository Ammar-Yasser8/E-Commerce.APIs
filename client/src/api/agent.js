import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7250/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
        // localized logout logic or redirect
    }
    return Promise.reject(error);
});

const requests = {
    get: (url, params) => axiosInstance.get(url, { params }).then(response => response.data),
    post: (url, body) => axiosInstance.post(url, body).then(response => response.data),
    put: (url, body) => axiosInstance.put(url, body).then(response => response.data),
    delete: (url) => axiosInstance.delete(url).then(response => response.data),
};

const Account = {
    login: (values) => requests.post('/Account/Login', values),
    register: (values) => requests.post('/Account/Register', values),
    currentUser: () => requests.get('/Account'),
    checkEmail: (email) => requests.get(`/Account/emailexist?email=${email}`),
    address: () => requests.get('/Account/address'),
    updateAddress: (values) => requests.put('/Account/address', values),
    updateAddress: (values) => requests.put('Account/address', values),
    list: () => requests.get('Account/users'),
    promote: (email) => requests.post(`Account/promote?email=${email}`)
};

const Products = {
    list: (params) => requests.get('products', params),
    details: (id) => requests.get(`products/${id}`),
    brands: () => requests.get('products/brands'),
    types: () => requests.get('products/categories'),
    create: (product) => requests.post('products', product),
    update: (id, product) => requests.put(`products/${id}`, product),
    delete: (id) => requests.delete(`products/${id}`)
};

const Basket = {
    get: (id) => requests.get(`basket?id=${id}`),
    addItem: (basket) => requests.post('basket', basket),
    removeItem: (id) => requests.delete(`basket?id=${id}`)
};

const Orders = {
    list: () => requests.get('orders'),
    listAll: () => requests.get('orders/all'),
    details: (id) => requests.get(`orders/${id}`),
    create: (values) => requests.post('orders', values),
    deliveryMethods: () => requests.get('orders/deliveryMethods'),
    updateStatus: (id, status) => requests.put(`orders/${id}/status`, status)
};

const Payments = {
    createPaymentIntent: (basketId) => requests.post(`/Payments/${basketId}`),
};

const agent = {
    Account,
    Products,
    Basket,
    Orders,
    Payments
};

export default agent;
