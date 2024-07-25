import { FC, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { useInitData, useViewport } from '@tma.js/sdk-react';
import { SyncLoader } from 'react-spinners';
import { ChannelContext } from '../../context/ChannelContext';
import { SubscribeContext } from '../../context/SubscribeContext';
import { LOCALES } from '../../i18n/locales';
import { messages } from '../../i18n/messages';
import HomePage from '../../pages/HomePage';
import { checkSubscription } from '../../services/checkSubscription';
import { ChannelType, getChannel } from '../../services/getChannel';
import { getUserProfile, UserProfileType } from '../../services/getUserProfile';
import { findBotUsername } from '../../utils/findBotUsername';
import ModalSubscribe from '../ModalSubscribe';

const App: FC = () => {
  const initData = useInitData();
  const viewport = useViewport();
  const userId = initData?.user?.id.toString();
  const botUsername = findBotUsername();

  const gameCount = parseInt(localStorage.getItem('gameCount') || '0', 10);

  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [count, setCount] = useState(gameCount);

  useEffect(() => {
    viewport?.expand();
  }, [viewport]);

  useEffect(() => {
    if (!userId || !botUsername) return;

    getChannel(botUsername).then((res) => {
      setChannel(res);
    });

    checkSubscription(userId, botUsername).then(({ result }) => {
      setIsSubscribe(result);
    });
  }, [userId, botUsername]);

  useEffect(() => {
    if (!userId || !botUsername) return;

    getUserProfile(userId, botUsername).then((res) => {
      setUserProfile(res);

      if (!isSubscribe && count >= 5) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });
  }, [userId, botUsername, isSubscribe, count]);

  if (!userProfile)
    return (
      <div className='w-full h-screen flex justify-center items-center fixed top-0 left-0 bg-black text-white'>
        <SyncLoader color='#fff' />
      </div>
    );

  return (
    <SubscribeContext.Provider value={{ isSubscribe, setIsSubscribe }}>
      <ChannelContext.Provider value={channel}>
        <IntlProvider
          messages={messages[LOCALES[userProfile?.languageCode || 'en'].value]}
          locale={LOCALES[userProfile?.languageCode || 'en'].value}
          defaultLocale={LOCALES.en.value}
        >
          <HomePage userProfile={userProfile} setCount={setCount} />
          {channel && !isSubscribe && (
            <ModalSubscribe isOpen={isOpen} onClose={() => setIsOpen(false)} />
          )}
        </IntlProvider>
      </ChannelContext.Provider>
    </SubscribeContext.Provider>
  );
};

export default App;
