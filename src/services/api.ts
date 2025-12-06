import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // backend URL

export const scanIC = (frontFile: File, backFile: File) => {
    const formData = new FormData();
    formData.append("front", frontFile);
    formData.append("back", backFile);
    return axios.post(`${API_URL}/scan-ic`, formData);
};

export const voiceEmbed = (audioFile: File) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    return axios.post(`${API_URL}/voice-embed`, formData);
};
