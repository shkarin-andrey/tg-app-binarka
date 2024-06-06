import { useInitData } from '@tma.js/sdk-react';
import { FC, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { SyncLoader } from 'react-spinners';

import { ChannelContext } from '../../context/ChannelContext';
import { useAxios } from '../../hooks/useAxios';
import { LOCALES } from '../../i18n/locales';
import { messages } from '../../i18n/messages';
import { Channel } from '../../interface/Channel.interface';
import HomePage from '../../pages/HomePage';
import { findBotUsername } from '../../utils/findBotUsername';
import ModalSubscribe from '../ModalSubscribe';

const { VITE_APP_GATEWAY_URL, VITE_APP_API_URL } = import.meta.env;

const App: FC = () => {
  const initData = useInitData();
  const userId = initData?.user?.id;
  const botUsername = findBotUsername();

  const [isOpen, setIsOpen] = useState(false);

  const { data: subscribe, loading: subscribeLoading } = useAxios(
    `${VITE_APP_API_URL}/check_subscription/${userId}/${botUsername}`,
    'GET',
  );

  console.log(subscribe, subscribeLoading);

  const { loading: channelLoading, data: channel } = useAxios<Channel>(
    `${VITE_APP_GATEWAY_URL}/webapp/credentials/${botUsername}`,
    'GET',
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  if (subscribeLoading || channelLoading)
    return (
      <div className='w-full h-screen flex justify-center items-center fixed top-0 left-0 bg-black text-white'>
        <SyncLoader color='#fff' />
      </div>
    );

  return (
    <ChannelContext.Provider value={channel}>
      <IntlProvider
        messages={messages[LOCALES[channel?.geo || 'en'].value]}
        locale={LOCALES[channel?.geo || 'en'].value}
        defaultLocale={LOCALES.en.value}
      >
        <HomePage />
        {channel && (
          <ModalSubscribe
            channelName={channel.channel_title}
            channelSrc={channel.image_link}
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      </IntlProvider>
    </ChannelContext.Provider>
  );
};

export default App;
