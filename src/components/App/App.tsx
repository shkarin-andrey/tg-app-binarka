import { FC, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { SyncLoader } from 'react-spinners';

import { useInitData, useViewport } from '@tma.js/sdk-react';
import { ChannelContext } from '../../context/ChannelContext';
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
  const userId = initData?.user?.id;
  const botUsername = findBotUsername();

  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    viewport?.expand();
  }, [viewport]);

  useEffect(() => {
    if (!userId || !botUsername) return;

    getChannel(botUsername).then((res) => {
      setChannel(res);
    });

    checkSubscription(userId, botUsername).then((res) => {
      setIsSubscribed(res);
    });
  }, [userId, botUsername]);

  useEffect(() => {
    if (!userId || !botUsername) return;

    getUserProfile(userId, botUsername).then((res) => {
      setUserProfile(res);

      if (!isSubscribed || res.wins >= 5) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });
  }, [userId, botUsername, isSubscribed]);

  if (!userProfile)
    return (
      <div className='w-full h-screen flex justify-center items-center fixed top-0 left-0 bg-black text-white'>
        <SyncLoader color='#fff' />
      </div>
    );

  return (
    <ChannelContext.Provider value={channel}>
      <IntlProvider
        messages={messages[LOCALES[userProfile?.languageCode || 'en'].value]}
        locale={LOCALES[userProfile?.languageCode || 'en'].value}
        defaultLocale={LOCALES.en.value}
      >
        <HomePage userProfile={userProfile} />
        {channel && !isSubscribed && (
          <ModalSubscribe isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </IntlProvider>
    </ChannelContext.Provider>
  );
};

export default App;
