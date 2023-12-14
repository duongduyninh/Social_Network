import Button from '@Components/Button';
import clsx from 'clsx';
import styles from '../../../userSetting.module.scss';
import stylesComp from './comp.module.scss';
import { useRef, useState } from 'react';

import useAuthentication from '@Hooks/useAuthentication';
import { IconLoading } from '@Components/icons/iconloading';
import { useChangePass } from '../Hooks/useChangePass';

const PasswordComp = () => {
  const auth = useAuthentication({});

  return (
    <div className="mt-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="cursor-default"
      >
        <div className={stylesComp['container']}>
          <p>Mật khẩu cũ</p>
          <div className="mb-6 relative">
            <input className={clsx(styles['inp'])} onChange={({ target: { value } }) => {}} type="password" />
          </div>
          <p>mật khẩu mới</p>
          <input className={clsx(styles['inp'])} type="password" onChange={({ target: { value } }) => {}} />
          <p>nhập lại mật khẩu mới</p>
          <div className="relative">
            <input className={clsx(styles['inp'])} type="password" onChange={({ target: { value } }) => {}} />
          </div>
        </div>
        <button>Lưu</button>
      </form>
    </div>
  );
};
export { PasswordComp };
