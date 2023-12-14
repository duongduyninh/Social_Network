import { IconClose } from '@Components/icons/iconClose';
import { IconLeftArrow } from '@Components/icons/iconLeftArrow';
import { IconRightArrow } from '@Components/icons/iconRightArrow';
import clsx from 'clsx';
import Image from 'next/image';
import { useRef } from 'react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './zoomImage.module.scss';

const arr = [1, 1];
export const ZoomImage = ({ images, cb }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      className={clsx(styles['ZoomImage'])}
      onClick={() => {
        cb();
      }}
    >
      <div
        ref={prevRef}
        className={clsx(styles['arrow'], styles['left'])}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles['arrow-wrapper']}>
          <IconLeftArrow width="40px" height="40px" />
        </div>
      </div>
      <div
        ref={nextRef}
        className={clsx(styles['arrow'], styles['right'])}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles['arrow-wrapper']}>
          <IconClose className={styles['icon']} onClick={cb} />
          <IconRightArrow width="40px" height="40px" />
        </div>
      </div>
      <Swiper
        navigation={{
          prevEl: prevRef?.current,
          nextEl: nextRef?.current,
        }}
        loop={true}
        modules={[Navigation]}
        className={clsx(styles['list'], 'mySwiper')}
        onInit={(swiper) => {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.update();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={i} className={styles['item']}>
            <div
              className={styles['image']}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={image} alt="" layout="fill" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
