import clsx from 'clsx';
import { forwardRef, useEffect, useRef, useState } from 'react';
import styles from '../input.module.scss';

export const TextInput = forwardRef(function SearchInput(
  { className, placeholder, icon, reset = true, content, editable = true, submit, handleChange, ...props },
  ref
) {
  const el = useRef(null);
  const refInp = useRef(null);
  const [element, setElement] = useState({
    width: 18,
    height: 18,
  });
  const EncodedContent = useRef(null);
  useEffect(() => {
    if (el.current) {
      const El = el.current;
      setElement({
        height: El.offsetHeight,
        width: El.offsetWidth,
      });
    }
  }, []);
  useEffect(() => {
    if (ref) {
      ref.current = refInp.current;
    }
  }, [refInp.current]);

  return (
    <div className="relative w-full h-full">
      {icon && (
        <span className={styles['icon']} ref={el}>
          {icon}
        </span>
      )}
      <div
        className={clsx(styles['input'], className)}
        contentEditable={editable}
        style={{
          paddingLeft: `${icon ? element.width * 2 + 'px' : '15px'}`,
        }}
        tabIndex={1}
        data-placeholder={placeholder}
        ref={refInp}
        onKeyUp={(e) => {
          const el = e.target;
          const html = el.innerHTML || '';
          let content = el.textContent || '';
          const regex = /(?<=<\/span>).+/gm;
          const found = html.match(regex);

          if (found) {
            content = found[0];
          } else {
            content = html;
          }

          EncodedContent.current = content;
          if (handleChange) {
            handleChange(content);
          }
        }}
        onPaste={(e) => {
          const target = e.target;
          const text = e.clipboardData.getData('text/plain');
          target.innerText += text;
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(target);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);

          e.preventDefault();
        }}
        {...props}
      >
        {content}
      </div>
    </div>
  );
});
