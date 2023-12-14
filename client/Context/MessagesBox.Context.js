import { createContext, useContext, useEffect, useRef, useState } from 'react';


const MessagesBoxContext = createContext({});
const MessagesBoxFunctionContext = createContext(
  {} 
);

export const MessagesBoxProvider = ({ children }) => {
  const [messageBoxes, setMessageBoxes] = useState([]);
  const ref = useRef(null);
  const PERCENT = 0.6;
  useEffect(() => {
    const handleResize = () => {
      setMessageBoxes((prev) => {
        let numberOfBoxes = 0;
        let isChanged = false;
        if (ref.current) {
          const node = ref.current.childNodes[0];
          if (node.classList.contains('boxWrapper')) {
            numberOfBoxes = Math.floor((document.body.clientWidth * PERCENT) / node.offsetWidth);
          }
        }

        prev.map((box, index) => {
          if (index >= numberOfBoxes) {
            box.opened = false;
            isChanged = true;
          } else {
            if (!box.opened) {
              box.opened = true;
              isChanged = true;
            }
          }
        });
        if (isChanged) {
          return [...prev];
        }
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  const MiddlewareAddedBox = (prev, box) => {
    let numberOfBoxes = 0;
    if (ref.current) {
      const node = ref.current.childNodes[0];
      if (node.classList.contains('boxWrapper')) {
        numberOfBoxes = Math.floor((document.body.clientWidth * PERCENT) / node.offsetWidth);
      }
    }
    prev.map((box, index) => {
      if (index >= numberOfBoxes - 1) {
        box.opened = false;
      }
    });
    return [box, ...prev];
  };
  const handleAddBox = ({ props }) => {
    setMessageBoxes((prev) => {
      let box = {} ;
      const boxes = prev.filter((oldBox) => {
        if (oldBox._userId !== props._userId) {
          return box;
        }
        box = oldBox;
        return false;
      });
      if (!box?._name) {
        return MiddlewareAddedBox(prev, props);
      } else {
        if (!box.opened) {
          box.opened = true;
          return MiddlewareAddedBox(boxes, box);
        }
      }
      return prev;
    });
  };

  const handleCloseBox = ({ props: { _userId } }) => {
    setMessageBoxes((prev) => prev.filter((box) => box._userId !== _userId));
  };

  const handleMinimizeBox = ({ _userId, ...props }) => {
    setMessageBoxes((prev) =>
      prev.map((box) => {
        if (box._userId === _userId) {
          return { _userId, ...props };
        }
        return box;
      })
    );
  };

  const handleOpenBox = ({ props }) => {
    setMessageBoxes((prev) => {
      const newBoxes = prev.filter((box) => box._userId !== props._userId);
      return MiddlewareAddedBox(newBoxes, { ...props, opened: true });
    });
  };



  return (
    <MessagesBoxContext.Provider value={{ messageBoxes }}>
      <MessagesBoxFunctionContext.Provider value={{ handleAddBox, handleMinimizeBox, handleCloseBox, handleOpenBox, ref }}>{children}</MessagesBoxFunctionContext.Provider>
    </MessagesBoxContext.Provider>
  );
};

export const useMessageBoxesContext = () => useContext(MessagesBoxContext);
export const useMessageBoxesContextFunction = () => useContext(MessagesBoxFunctionContext);
