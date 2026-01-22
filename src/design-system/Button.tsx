import { type ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  iconLeft?: boolean;
  iconRight?: boolean;
  iconOnly?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    onClick,
    variant = 'primary',
    size = 'large',
    className = '',
    disabled = false,
    iconLeft = false,
    iconRight = false,
    iconOnly = false,
  } = props;
  const getIconContent = () => {
    if (iconOnly) {
      return <span className="btn-icon">→</span>;
    }
    if (iconLeft) {
      return (
        <>
          <span className="btn-icon btn-icon-left">←</span>
          {children}
        </>
      );
    }
    if (iconRight) {
      return (
        <>
          {children}
          <span className="btn-icon btn-icon-right">→</span>
        </>
      );
    }
    return children;
  };

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${iconOnly ? 'btn-icon-only' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {getIconContent()}
    </button>
  );
};
