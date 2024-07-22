import { useFormik } from 'formik';
import { FC, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

import { useInitData } from '@tma.js/sdk-react';
import { withdrawBalance } from '../../services/withdrawBalance';
import { findBotUsername } from '../../utils/findBotUsername';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import { IModalWithdraw } from './ModalWithdraw.interface';

const ModalWithdraw: FC<IModalWithdraw> = ({ balance, setBalance, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const intl = useIntl();

  const initData = useInitData();
  const userId = initData?.user?.id.toString();

  const botUsername = findBotUsername();

  const initialValues = {
    amount: '',
    details: '',
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    setIsOpen(true);
  };

  const validationSchema = Yup.object({
    amount: Yup.string()
      .trim()
      .min(8, 'Длина номера должна быть больше 8 символов')
      .required('Введите номер карты или счета'),
    details: Yup.string()
      .trim()
      .matches(/^\d+$/, 'Поле должно содержать только цифры')
      .test(
        'length',
        (value) => {
          const count = parseInt(value.value, 10);
          if (count <= 0) {
            return 'Сумма должна быть больше нуля';
          }

          if (count > balance) {
            return `Превышен лимит, вам доступно ${balance}$`;
          }
        },
        () => {
          return false;
        },
      )
      .required('Введите сумму вывода'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const details = parseInt(values.details, 10);
    setIsLoading(true);

    withdrawBalance(userId || '', details, botUsername || '')
      .then(() => {
        setBalance((prev) => prev - details);
        handleClose();
        formik.resetForm();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const placeholderDetails = intl.formatMessage({
    id: 'withdraw_modal_placeholder_details',
  });

  const placeholderAmount = intl.formatMessage({
    id: 'withdraw_modal_placeholder_amount',
  });

  const labelAmount = intl.formatMessage({ id: 'amount' });
  const labelDetails = intl.formatMessage({ id: 'details' });

  const isActive = useCallback(
    (count: number) => {
      if (active === count) {
        return 'bg-purple';
      }

      return '';
    },
    [active],
  );

  const handleSelectType = (count: number) => {
    setActive(count);
  };

  return (
    <>
      <Button
        disabled={isDisabled}
        onClick={handleOpen}
        className='bg-primary-100 text-xs lg:text-[13px] px-[7px] py-0.5 disabled:bg-gray'
      >
        <FormattedMessage id='withdraw_btn' />
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit} className='min-w-[285px]'>
          <div className='text-center font-bold text-lg'>
            <FormattedMessage id='withdraw_funds' />
          </div>
          <div className='flex mt-5 justify-center'>
            <Button
              type='button'
              onClick={() => handleSelectType(0)}
              className={`text-xs border !rounded-none border-purple !rounded-l-xl ${isActive(
                0,
              )}`}
            >
              CARD
            </Button>
            <Button
              type='button'
              onClick={() => handleSelectType(1)}
              className={`text-xs border !rounded-none border-purple !rounded-r-xl ${isActive(
                1,
              )}`}
            >
              USDT
            </Button>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <Input
              placeholder={placeholderDetails}
              label={labelDetails}
              className={
                formik.touched.amount && formik.errors.amount ? 'border-red' : ''
              }
              labelClassName={
                formik.touched.amount && formik.errors.amount ? 'text-red' : ''
              }
              {...formik.getFieldProps('amount')}
            />

            <Input
              placeholder={placeholderAmount}
              label={labelAmount}
              className={
                formik.touched.details && formik.errors.details ? 'border-red' : ''
              }
              labelClassName={
                formik.touched.details && formik.errors.details ? 'text-red' : ''
              }
              {...formik.getFieldProps('details')}
            />
          </div>
          <div className='flex flex-col gap-2 mt-5'>
            <Button
              type='submit'
              className='bg-primary-100 w-full rounded-[4px] disabled:bg-gray'
              disabled={isLoading}
            >
              <FormattedMessage id='submit' />
            </Button>
            <Button
              type='button'
              className='!text-primary-100 w-full rounded-[4px]'
              onClick={handleClose}
            >
              <FormattedMessage id='close' />
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ModalWithdraw;
