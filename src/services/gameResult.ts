import { api } from './api';

export const gameResult = async (
  userId: string,
  botUsername: string,
  win: string,
  amount: number,
) => {
  const res = await api.post<{ result: boolean }>(`/game-result`, {
    userId,
    botUsername,
    win,
    amount,
  });
  const data = res.data;

  return data;
};
