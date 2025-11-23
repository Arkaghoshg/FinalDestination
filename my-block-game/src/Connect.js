import axios from 'axios';

const API_URL = "http:// 192.168.56.1:5000/api"; // apna computer ka IPv4 address dalna

const addPoints = async(username,points) =>{
    try {
        const response = await axios.post(`${API_URL}/add`,{username, points});
        return response.data;
    } catch (error) {
        console.error("error in adding points",error);
        throw error;
    }
};

const getLeaderboard = async () =>{
    try {
        const response = await axios.get(`${API_URL}/leaderboard`);
        return response.data;
    } catch (error) {
        console.error("unable to fetch leaderboard");
        throw error
    }
};

module.exports = { addPoints, getLeaderboard };




