import axios from 'axios';

const ORDER_SERVICE_URL = 'http://localhost:5002/api';

const getOrderDetails = async (orderId: string) => {
    try {
        const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching order details');
    }
};

export default {
    getOrderDetails
};
