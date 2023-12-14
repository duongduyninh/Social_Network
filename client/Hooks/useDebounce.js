import { useRef } from 'react';

function useDebounce() {
  const typingTimeout = useRef();
  function debounce(fn, wait) {
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => fn(), wait);
  }
  function ClearTimeOut() {
    clearTimeout(typingTimeout.current);
  }
  return { debounce, ClearTimeOut };
}

export { useDebounce };
