
import NextImage from 'next/image';
import { useRef } from 'react';


export const Image = ({ change, children, multiple, disabled = false, onChange, ...props }) => {
  const ref = useRef(null);
  if (change) {
    return (
      <>
        <input type="file" ref={ref} multiple={multiple} className="hidden" onChange={onChange} />
        <div
          onClick={() => {
            if (ref.current && !disabled) {
              ref.current.click();
            }
          }}
          className="flex items-center justify-center"
        >
          {(props.src && <NextImage {...props} />) || null}
          {children || null}
        </div>
      </>
    );
  }
  return <NextImage {...props} />;
};
