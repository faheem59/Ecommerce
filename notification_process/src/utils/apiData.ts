import axios from 'axios'; // Assuming you're using axios for HTTP requests

const getUserDetails = async (userId: string): Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export { getUserDetails };
