import axios from "axios";

const BASE_URL = 'https://virtual-assistant-api.onrender.com/';

axios.defaults.baseURL = BASE_URL;

export const createConversation = async () => {
  const response = await axios.post('/conversation');
  return response.data;
}

export const askConversation = async (conversationId: string, audioForm: FormData) => {
  const response = await axios({
    method: "post",
    url: `/conversation/${conversationId}/ask`,
    data: audioForm,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob"
  });
  return response.data;
}