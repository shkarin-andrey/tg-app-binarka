import { api } from './api';

type WithdrawBalance = {
  message: string;
  new_balance: number;
};

export const withdrawBalance = async (
  userId: string,
  amount: number,
  botUsername: string,
) => {
  const res = await api.post<WithdrawBalance>(`/withdraw`, {
    userId,
    amount,
    botUsername,
  });
  const data = res.data;

  return data;
};
