import axios from "axios";
import { SignUpRequest } from "./types";

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

export const signUp = async (signUpForm: SignUpRequest) => {
  const response = await axios({
    method: "post",
    url: "/user/signup",
    data: signUpForm,
    headers: { "Content-Type": "application/json" },
    responseType: "json"
  });
  return response.data;
}

export const signIn = async (signInForm: FormData) => {
  const response = await axios({
    method: "post",
    url: "/user/login",
    data: signInForm,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob"
  });
  return response.data;
}

export const changePassword = async (changePasswordForm: FormData) => {
  const response = await axios({
    method: "post",
    url: "/user/change-password",
    data: changePasswordForm,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob"
  });
  return response.data;
}