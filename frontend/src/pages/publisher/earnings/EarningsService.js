import apiClient from '../../../services/apiClient';

const EarningsService = {
    getEarningsStats: async () => {
        const response = await apiClient.get('/publisher/earnings/stats');
        return response.data;
    },

    getTransactionHistory: async (page = 0, size = 10) => {
        const response = await apiClient.get(`/publisher/earnings/transactions?page=${page}&size=${size}`);
        return response.data;
    }
};

export default EarningsService;
