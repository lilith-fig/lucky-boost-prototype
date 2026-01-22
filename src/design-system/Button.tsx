import { type ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
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
      if (iconLeft && typeof iconLeft !== 'boolean') {
        return <span className="btn-icon">{iconLeft}</span>;
      }
      return <span className="btn-icon">→</span>;
    }
    if (iconLeft) {
      const leftIcon = typeof iconLeft === 'boolean' ? (
        <span className="btn-icon btn-icon-left">←</span>
      ) : (
        <span className="btn-icon btn-icon-left">{iconLeft}</span>
      );
      return (
        <>
          {leftIcon}
          {children}
        </>
      );
    }
    if (iconRight) {
      const rightIcon = typeof iconRight === 'boolean' ? (
        <span className="btn-icon btn-icon-right">→</span>
      ) : (
        <span className="btn-icon btn-icon-right">{iconRight}</span>
      );
      return (
        <>
          {children}
          {rightIcon}
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
