import styles from './loading.module.scss';

function Loading({ width = '0' }) {
  return <section className={styles['wrapper']} style={{ width: `${width}%` }}></section>;
}

export default Loading;
