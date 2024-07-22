import { useInitData, useMiniApp } from '@tma.js/sdk-react';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import GrammerlyIcon from '../../assets/icons/grammerly.svg';
import InformationIcon from '../../assets/icons/information.svg';
import { gameHelp } from '../../services/gameHelp';
import { findBotUsername } from '../../utils/findBotUsername';
import { getRandom } from '../../utils/getRandom';

const randomUsers = getRandom(250, 270);

const Header: FC = () => {
  const [online, setOnline] = useState(randomUsers);

  const botUsername = findBotUsername();

  const initData = useInitData();
  const miniApp = useMiniApp();

  useEffect(() => {
    const interval = setInterval(() => {
      setOnline(getRandom(250, 270));
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const userId = initData?.user?.id.toString();

    if (!userId || !botUsername) return;

    gameHelp(userId, botUsername).then(() => miniApp.close());
  };

  return (
    <div className='w-full text-white text-[10px] sm:text-[12px] lg:text-[13px] flex items-center justify-between'>
      <div className='flex items-center gap-[5px]'>
        <GrammerlyIcon />
        <div>
          {online}{' '}
          <span className='text-[#868686] uppercase'>
            <FormattedMessage id='online' />
          </span>
        </div>
      </div>
      <InformationIcon className='cursor-pointer' onClick={handleClick} />
    </div>
  );
};

export default Header;
