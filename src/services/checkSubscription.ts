import { api } from './api';

export const checkSubscription = async (userId: string, botUsername: string) => {
  const res = await api.get<{ result: boolean }>(`/check-subscription`, {
    params: {
      userId,
      botUsername,
      reward: 100,
    },
  });
  const data = res.data;

  return data;
};
