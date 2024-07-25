import { createContext } from 'react';

type SubscribeContextType = {
  isSubscribe: boolean;
  setIsSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubscribeContext = createContext<SubscribeContextType>({
  isSubscribe: false,
  setIsSubscribe: () => {},
});
