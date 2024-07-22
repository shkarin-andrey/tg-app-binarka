import { api } from './api';

export const gameHelp = async (userId: string, botUsername: string) => {
  const res = await api.post(`/get-help`, {
    userId,
    botUsername,
  });
  const data = res.data;

  return data;
};
