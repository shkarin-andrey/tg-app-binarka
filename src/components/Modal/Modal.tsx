import { FC, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import CloseIcon from '../../assets/icons/close.svg';
import ReactPortal from '../ReactPortal';
import { IModal } from './Modal.interface';
import style from './Modal.module.css';

const Modal: FC<IModal> = ({ children, isOpen, onClose, className = '' }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!onClose) return;

    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? onClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose]);

  return (
    <ReactPortal>
      <CSSTransition
        in={isOpen}
        timeout={200}
        unmountOnExit
        classNames={style.modal}
        nodeRef={nodeRef}
      >
        <div className={`${style.modal} ${className}`} ref={nodeRef}>
          <div className='rounded-xl pb-5 pt-10 px-4 bg-[#313131] text-white relative'>
            {onClose && (
              <div
                aria-hidden
                className='w-5 h-5 rounded flex justify-center items-center bg-white absolute right-4 top-4 cursor-pointer text-black'
                onClick={onClose}
              >
                <CloseIcon />
              </div>
            )}
            {children}
          </div>
        </div>
      </CSSTransition>
    </ReactPortal>
  );
};

export default Modal;
