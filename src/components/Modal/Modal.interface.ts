import { ReactNode } from 'react';

export interface IModal {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}
