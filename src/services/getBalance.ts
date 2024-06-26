import axios from 'axios';

import { Balance } from '../interface/Balance.Interface';

const { VITE_APP_API_URL } = import.meta.env;

export const getBalance = async (userId: number, botUsername: string) => {
  const res = await axios.get<Balance>(
    `${VITE_APP_API_URL}/get_user_balance/${userId}?bot_username=${botUsername}`,
  );
  const data = res.data;

  return data;
};
