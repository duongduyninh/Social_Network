import clsx from 'clsx';
import { useState } from 'react';
import styles from '../../userSetting.module.scss';

const Security = () => {
  const [row, setRow] = useState();

  return (
    <section className={clsx(styles['main'])}>
      <h1 className="text-xl">Security </h1>
      <section className={styles['settings-list']}>
        <div className={styles['settings-item']}>
          <div className={clsx(styles['settings-item-wrapper'])}>
            <p>title</p>
            <div className="flex items-center">
              <p className={clsx(styles['btn'], 'inline ml-2')} onClick={(e) => {}}>
                Close
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
export { Security };
