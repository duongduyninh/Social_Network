import Button from '@Components/Button';
import { createPortal } from 'react-dom';
import styles from './alertModal.module.scss';

const AlertModal = ({ selector, cbAccept, cbCancel, content, btnAccept, btnCancel }) => {
  return createPortal(
    <section className={styles['portal']}>
      <section className={styles['wrapper']}>
        <p>{content}</p>
        <div className={styles['wrapper-btn']}>
          {btnCancel && (
            <Button type="secondary" className={styles['wrapper-btn_cancel']} hover onClick={cbCancel}>
              {btnCancel}
            </Button>
          )}
          {btnAccept && (
            <Button type="secondary" className={styles['wrapper-btn_accept']} hover onClick={cbAccept}>
              {btnAccept}
            </Button>
          )}
        </div>
      </section>
    </section>,
    document.querySelector(selector)
  );
};

export { AlertModal };

