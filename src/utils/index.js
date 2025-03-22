import axios from "./axios";

export const get = axios.get;
export const post  = axios.post;

export const getUserInfo = async() => {
  return await get('/userInfo')
}