import { IconAngry } from '@Components/icons/ReactIcon/iconAngry';
import { IconCare } from '@Components/icons/ReactIcon/iconCare';
import { IconHaha } from '@Components/icons/ReactIcon/iconHaha';
import { IconLike } from '@Components/icons/ReactIcon/iconLike';
import { IconLove } from '@Components/icons/ReactIcon/iconLove';
import { IconSad } from '@Components/icons/ReactIcon/iconSad';
import { IconWow } from '@Components/icons/ReactIcon/iconWow';
import styles from './reaction.module.scss';

const width = '36px';
const icons = [
  { icon: <IconLike width={width} />, type: '0' },
  { icon: <IconLove width={width} />, type: '1' },
  { icon: <IconCare width={width} />, type: '2' },
  { icon: <IconHaha width={width} />, type: '3' },
  { icon: <IconWow width={width} />, type: '4' },
  { icon: <IconSad width={width} />, type: '5' },
  { icon: <IconAngry width={width} />, type: '6' },
];

function Reaction({ fn }) {
  return (
    <section className={styles['wrapper']} onClick={(e) => e.stopPropagation()}>
      {icons.map(({ icon, type }, index) => (
        <div
          key={index}
          className={styles['icon']}
          onClick={(e) => {
            e.stopPropagation();
            fn({ type });
          }}
        >
          {icon}
        </div>
      ))}
      <IconLike />
    </section>
  );
}

export default Reaction;
