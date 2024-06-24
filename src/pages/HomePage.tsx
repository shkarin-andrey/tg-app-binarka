import { FC, useCallback, useContext, useEffect, useState } from 'react';

import { useInitData, useUtils, useViewport } from '@tma.js/sdk-react';
import { FormattedMessage } from 'react-intl';
import CupIcon from '../assets/icons/cup.svg';
import Balance from '../components/Balance';
import Button from '../components/Button';
import Chart from '../components/Chart';
import Header from '../components/Header';
import Time from '../components/Time';
import { END_RANDOM, START_RANDOM } from '../config';
import { ChannelContext } from '../context/ChannelContext';
import { SubscribeModalContext } from '../context/SubscribeModalContext';
import { getBalance } from '../services/getBalance';
import { getWins } from '../services/getWins';
import { updateBalance } from '../services/updateBalance';
import { updateIncreaseWins } from '../services/updateIncreaseWins';
import { findBotUsername } from '../utils/findBotUsername';
import { generateRandomSign } from '../utils/generateRandomSign';
import { getRandom } from '../utils/getRandom';

type ButtonToggleType = 'up' | 'down';

const { VITE_TIME_SECOND, VITE_COUNT_WIN_OR_LOSE } = import.meta.env;
const defaultCount = parseInt(VITE_COUNT_WIN_OR_LOSE, 10) || 10;
const defaultTime = parseInt(VITE_TIME_SECOND, 10) || 5;

const HomePage: FC = () => {
  const context = useContext(ChannelContext);
  const contextSubscribe = useContext(SubscribeModalContext);

  const initData = useInitData();
  const viewport = useViewport();
  const utils = useUtils();

  const userId = initData?.user?.id;

  const [data, setData] = useState<number[]>([getRandom(START_RANDOM, END_RANDOM)]);
  const [time, setTime] = useState<number>(defaultTime);
  const [start, setStart] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [end, setEnd] = useState(0);
  const [type, setType] = useState<ButtonToggleType>();
  const [balance, setBalance] = useState(0);

  const botUsername = findBotUsername();

  useEffect(() => {
    getBalance(userId || 0, botUsername || '').then((res) => setBalance(res.balance));
  }, [userId, balance, botUsername]);

  const count = data.at(-1) || 0;

  const handleSubscribe = () => {
    if (!context?.invite_link) return;

    utils.openTelegramLink(context.invite_link);
  };

  const handleUpOrDown = (toggle: ButtonToggleType) => {
    setDisabled(true);
    setStart(count);
    setIsWin(null);
    setEnd(0);
    setType(toggle);
  };

  const winOrLoseUpdate = useCallback(
    (toggle: boolean) => {
      const countWinOrLose = toggle ? defaultCount : -defaultCount;

      setIsWin(toggle);
      setBalance((prev) => prev + countWinOrLose);

      updateBalance(userId || 0, countWinOrLose, botUsername || '');
      updateIncreaseWins(userId || 0).then(() => {
        if (contextSubscribe?.isSubscribed) return;

        getWins(userId || 0, botUsername || '').then(({ wins }) => {
          if (wins < 4) return;
          contextSubscribe?.setIsOpen(true);
        });
      });
    },
    [userId, botUsername, contextSubscribe?.isSubscribed],
  );

  useEffect(() => {
    if (!disabled) return;

    if (time < 0) {
      setTime(defaultTime);
      setDisabled(false);
      setEnd(count);

      if ((type === 'up' && count > start) || (type === 'down' && count <= start)) {
        return winOrLoseUpdate(true);
      }

      if ((type === 'up' && count <= start) || (type === 'down' && count > start)) {
        return winOrLoseUpdate(false);
      }
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled, time, winOrLoseUpdate]);

  const generateNextItem = useCallback((number: number[]): number => {
    const generateDataItem = getRandom(1, 10);
    const sign = generateRandomSign();

    const newDataItem: number = eval(number.at(-1) + sign + generateDataItem);

    if (newDataItem <= START_RANDOM || newDataItem >= END_RANDOM) {
      return generateNextItem(number);
    }

    return newDataItem;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        if (prev.length >= 15) {
          prev.shift();
        }

        const newDataItem = generateNextItem(prev);

        return [...prev, newDataItem];
      });
    }, 1_000);
    return () => clearInterval(interval);
  }, [generateNextItem]);

  return (
    <div
      className='w-full bg-[#1C1C1D] px-4 pt-5 pb-10 flex flex-col justify-between gap-5 overflow-y-auto'
      style={{
        minHeight: viewport?.stableHeight || '100vh',
        overscrollBehavior: 'none',
      }}
    >
      <div className='flex flex-col gap-[10px]'>
        <Header />
        <Chart data={data} count={count} start={start} end={end} isWin={isWin} />
        <Time value={time} />
      </div>
      <div className='w-full flex flex-col gap-[10px]'>
        <Button
          className='w-full bg-purple text-xs font-medium'
          leftIcon={<CupIcon />}
          rightIcon={<CupIcon />}
          onClick={handleSubscribe}
        >
          <FormattedMessage id='subscription_btn' />
        </Button>
        <Balance
          isDisabled={disabled}
          value={balance}
          isWin={isWin}
          setBalance={setBalance}
        />
        <div className='flex items-center gap-[10px] w-full'>
          <Button
            disabled={disabled}
            onClick={() => handleUpOrDown('up')}
            className='bg-green w-full overflow-hidden text-sm !text-black relative font-semibold py-[9px] rounded-[10px] shadow-btn-green uppercase disabled:bg-green/50 disabled:cursor-not-allowed before:content-[""] before:w-[100px] before:h-[100px] before:bg-[#20FF80] before:z-0 before:absolute before:rotate-45 before:top-[25px] before:rounded-md disabled:before:bg-[#20FF80]/30'
          >
            <div className='z-10'>
              ${defaultCount} <FormattedMessage id='up_btn' />
            </div>
          </Button>
          <Button
            disabled={disabled}
            onClick={() => handleUpOrDown('down')}
            className='bg-red w-full overflow-hidden text-sm font-semibold py-[9px] relative rounded-[10px] shadow-btn-red uppercase disabled:bg-red/50 disabled:cursor-not-allowed before:content-[""] before:w-[100px] before:h-[100px] before:bg-[#E75085] before:z-0 before:absolute before:rotate-45 before:bottom-[25px] before:rounded-md disabled:before:bg-[#E75085]/30'
          >
            <div className='z-10'>
              ${defaultCount} <FormattedMessage id='down_btn' />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
