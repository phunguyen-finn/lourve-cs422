import axios from 'axios';
import { ChangePasswordRequest, SignInRequest, SignUpRequest } from './types';
import store from 'renderer/store';

const BASE_URL = 'https://virtual-assistant-api.onrender.com/';

axios.interceptors.request.use((req: any) => {
  const token = store.get('token');
  if (token) req.headers.authorization = `Bearer ${token}`;
  return req;
});

axios.defaults.baseURL = BASE_URL;

export const createConversation = async () => {
  const response = await axios.post('/conversation');
  return response.data;
};

export const askConversation = async (
  conversationId: string,
  audioForm: FormData
) => {
  const response = await axios({
    method: 'post',
    url: `/conversation/${conversationId}/ask`,
    data: audioForm,
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
  return response.data;
};

export const signUp = async (data: SignUpRequest) => {
  try {
    const response = await axios({
      method: 'post',
      url: '/user/signup',
      data,
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json',
    });
    return response.data;
  } catch (e) {
    return null;
  }
};

export const signIn = async (data: SignInRequest) => {
  try {
    const response = await axios({
      method: 'post',
      url: '/user/login',
      data,
      headers: { 'Content-Type': 'application/json' },
    });
    store.set('token', response.data.access_token);
    return response.data;
  } catch (e) {
    return null;
  }
};

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await axios({
    method: 'post',
    url: '/user/change-password',
    data,
    headers: { 'Content-Type': 'application/json' },
    responseType: 'blob',
  });
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get('/user/me');
  store.set('user', response.data.username);
  return response.data;
}

export const getConversations = async () => {
  const conversations: any = await axios.get(`/user/me/conversation`);
  const promises: any = [];
  (conversations as any).data.forEach((conversation: any) => {
    promises.push(axios.get(`/conversation/${conversation.id}`));
  });
  const responses = await Promise.all(promises);
  const logs = responses.map((response: any, index) => { return {...response.data, conversationId: conversations.data[index].id}});
  return logs;
}