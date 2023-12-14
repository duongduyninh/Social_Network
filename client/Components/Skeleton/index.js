import clsx from 'clsx';
import styles from './skeleton.module.scss';



function Skeleton({ width, height, type, className, anim = true, ...props }) {
  return (
    <div
      className={clsx(
        {
          [styles['skeleton_anim']]: anim,
          [styles['skeleton_notAnim']]: true,
        },
        styles[type],
        className
      )}
      {...props}
      style={{
        width,
        height,
      }}
    ></div>
  );
}

export default Skeleton;
