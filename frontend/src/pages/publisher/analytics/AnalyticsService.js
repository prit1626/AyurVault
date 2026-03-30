import apiClient from '../../../services/apiClient';

const AnalyticsService = {
    getAnalytics: async () => {
        const response = await apiClient.get('/publisher/analytics');
        return response.data;
    }
};

export default AnalyticsService;
