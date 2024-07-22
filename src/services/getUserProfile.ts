import { LOCALES } from '../i18n/locales';
import { api } from './api';

export type UserProfileType = {
  balance: number;
  bot: string;
  createdAt: string;
  firstName: string;
  id: string;
  languageCode: keyof typeof LOCALES;
  lastName: string;
  subscriptionStatus: boolean;
  telegramId: string;
  updatedAt: string;
  wins: number;
};

export const getUserProfile = async (userId: string, botUsername: string) => {
  const res = await api.get<UserProfileType>(`/user-profile`, {
    params: {
      userId,
      botUsername,
    },
  });
  const data = res.data;

  return data;
};
