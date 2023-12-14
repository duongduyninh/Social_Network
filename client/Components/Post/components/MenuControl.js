import { IconBin } from '@Components/icons/iconBin';
import { IconPen } from '@Components/icons/iconPen';
import DetectContext from '@Context/DetectElement.Context';
import { useContext, useEffect, useRef } from 'react';
import style from '../post.module.scss';

function MenuControl({ id, handleDelete, handleShowMenu, handleShowPost }) {
  const { element, handleSetElement } = useContext(DetectContext);
  const ref = useRef(null);
  useEffect(() => {
    if (element && !ref?.current?.contains(element)) {
      handleShowMenu(false);
    }
    return () => handleSetElement();
  }, [element]);
  return (
    <div
      className={style['subBars']}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <p className={style['item-control']} onClick={() => handleShowPost()}>
        <IconPen /> Edit
      </p>

      <p className={style['item-control']} onClick={() => handleDelete(id)}>
        <IconBin /> Delete
      </p>
    </div>
  );
}

export default MenuControl;
