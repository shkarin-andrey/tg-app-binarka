import { api } from './api';

export type ChannelType = {
  channel_picture: string;
  channel_title: string;
  invite_link: string;
};

export const getChannel = async (botUsername: string) => {
  const res = await api.post<ChannelType>(`/get-channel`, {
    botUsername,
  });
  const data = res.data;

  return data;
};
