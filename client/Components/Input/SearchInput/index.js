import clsx from 'clsx';
import {
  forwardRef,
  useEffect,
  useRef,
  useState
} from 'react';
import styles from '../input.module.scss';


export const SearchInput = forwardRef(function SearchInput(
  { className, placeholder, icon, ...props },
  ref
) {
  const inputRef = useRef();
  const el = useRef(null);
  const [element, setElement] = useState({
    width: 18,
    height: 18,
  });

  useEffect(() => {
    if (el.current) {
      const El = el.current;
      setElement({
        height: El.offsetHeight,
        width: El.offsetWidth,
      });
    }
  }, []);

  return (
    <div className="relative w-[inherit]">
      {icon && (
        <span className={styles['icon']} ref={el}>
          {icon}
        </span>
      )}
      <input
        className={clsx(styles['input'], className)}
        style={{
          paddingLeft: `${icon ? element.width * 2 + 'px' : '15px'}`,
        }}
        placeholder={placeholder}
        ref={(target) => {
          inputRef.current = target;
          if (ref) {
            ref.current = target;
          }
        }}
        {...props}
      ></input>

    </div>
  );
});
