import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './button.module.scss';


const Button = forwardRef(function Button(
  { children, disabled, className, hover, type = 'primary', padding = '16px', leftIcon, rightIcon, ...props },
  ref
) {
  if (disabled) {
    Object.keys(props).forEach((key) => {
      
      const newProps = props;
      if (key.startsWith('on') && typeof newProps[key] === 'function')
        newProps[key] = (e) => {
          e.preventDefault();
          e.stopPropagation();
        };
    });
  }
  return (
    <button
      className={clsx(
        styles['wrapper'],
        {
          [styles[type]]: true,
          [styles['disabled']]: disabled,
          [styles['hover']]: hover,
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {leftIcon && <span className={clsx('mr-2', styles['icon'])}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={clsx('ml-2', styles['icon'])}>{rightIcon}</span>}
    </button>
  );
});

export default Button;
