import apiClient from '../../../services/apiClient';

const uploadNote = async (formData) => {
    const response = await apiClient.post('/publisher/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        // Capture upload progress if needed
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
        }
    });
    return response.data;
};

const UploadService = {
    uploadNote
};

export default UploadService;
