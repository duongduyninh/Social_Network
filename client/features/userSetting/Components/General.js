import { IconPen } from '@Components/icons/iconPen';
import useAuthentication from '@Hooks/useAuthentication';
import clsx from 'clsx';
import styles from '../userSetting.module.scss';
import stylesGeneral from './general.module.scss';

const General = () => {
  const auth = useAuthentication({});

  return (
    <section className={clsx(styles['main'])}>
      <h1 className="text-xl">General Account Settings</h1>
      <section className={styles['settings-list']}>
        <div className={styles['settings-item']}>
          <div className={clsx(styles['settings-item-wrapper'])}>
            <p>content</p>
            <div>
              <form
                className={stylesGeneral['container']}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  className={clsx(styles['inp'])}
                  // defaultValue={}
                  autoFocus
                  onChange={(e) => {}}
                />
                <div className={stylesGeneral['btn']}>
                  <button>Save</button>
                  <p className={stylesGeneral['btn_close']}>close</p>
                </div>
              </form>
            </div>
            <p className={clsx(styles['btn'])}>
              <IconPen width="13px" className={styles['icon']} /> Edit
            </p>
          </div>
        </div>
      </section>
    </section>
  );
};
export { General };
