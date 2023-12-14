import { IconDoubleArrowLeft } from '@Components/icons/ReactIcon/iconDoubleArrowLeft';
import { IconDoubleArrowRight } from '@Components/icons/iconDoubleArrowRight';
import { IconSecurity } from '@Components/icons/iconSecurity';
import { IconSettings } from '@Components/icons/iconSettings';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { General } from './Components/General';
import { Security } from './Components/Security/Security';
import styles from './userSetting.module.scss';

function UserSetting() {
  const router = useRouter();
  const [tab, setTab] = useState(router.query.tab || 'general');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = (state) => () => {
    setIsOpenModal(state);
  };

  const handleTab = (type) => () => {
    setTab(type);
    if (type !== 'general') {
      router.replace({
        query: { tab: type },
      });
    } else {
      router.replace({
        query: '',
      });
    }
  };

  return (
    <section className={clsx(styles['userSetting'])}>
      <section className={clsx(styles['wrapper'])}>
        {!isOpenModal ? (
          <IconDoubleArrowRight className={styles['icon_arrow']} onClick={handleOpenModal(true)} />
        ) : (
          <IconDoubleArrowLeft className={styles['icon_arrow']} onClick={handleOpenModal(false)} />
        )}
        <section
          className={clsx(styles['settings'])}
          style={{
            display: isOpenModal ? 'block' : 'none',
          }}
        >
          <h1 className="text-xl">Settings</h1>
          <div className="pt-10">
            <div
              className={clsx(styles['settings-icon'], {
                [styles['active']]: tab === 'general' ? true : false,
              })}
              onClick={handleTab('general')}
            >
              <IconSettings />
              <p>General</p>
            </div>
            <div
              className={clsx(styles['settings-icon'], {
                [styles['active']]: tab === 'security' ? true : false,
              })}
              onClick={handleTab('security')}
            >
              <IconSecurity className={styles['security']} />
              <p>Security</p>
            </div>
          </div>
        </section>
        {tab === 'general' ? <General /> : <Security />}
      </section>
    </section>
  );
}

export { UserSetting };
