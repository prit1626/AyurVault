import apiClient from '../../../services/apiClient';

const MyNotesService = {
    getMyNotes: async (search) => {
        const url = search ? `/publisher/my-notes?search=${encodeURIComponent(search)}` : '/publisher/my-notes';
        const response = await apiClient.get(url);
        return response.data;
    },

    updateNote: async (id, noteData) => {
        const response = await apiClient.put(`/publisher/note/${id}`, noteData);
        return response.data;
    },

    deleteNote: async (id) => {
        await apiClient.delete(`/publisher/note/${id}`);
    }
};

export default MyNotesService;
