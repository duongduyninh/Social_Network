import clsx from 'clsx';
import Link from 'next/link';
import { BsMoonStarsFill } from 'react-icons/bs';
import { Image } from '../../Components/Image';
import image from '../../public/images/social-networking.png';
import styles from './default.module.scss';

function DefaultLayout({ type, path, children }) {

 
  return (
    <section
      className={clsx(styles['wrapper'])}
    >
  
      <section className={styles['main']}>
        {/* <div className="flex justify-between gap-4">
          <div className="font-semibold text-lg">Your Logo</div>
          <div>

            <BsMoonStarsFill
              className="text-xl cursor-pointer"
              onClick={() => {
  
              }}
              color="#e9c46a"
            />
          </div>
        </div> */}
        <section className="lg:flex lg:flex-row lg:items-center mt-10 gap-10 flex-1 ">
          <section className="mb-12 lg:m-0 lg:-translate-y-32 flex-1 relative ">
            {/* <div className="mb-8">
              <div className="text-2xl lg:text-5xl lg:mb-6 font-semibold">Sign in up</div>
              <div className="text-xl lg:text-4xl font-medium">Lorem Ipsum is simply</div>
            </div>
            <div className="text-sm text-base">
              If you already have an account register You can <pre />
              <Link href={path}>
                <a className="text-violet-800 font-semibold">{type} here !</a>
              </Link>
            </div> */}
            <div className="absolute right-0 hidden lg:block">
              <Image src={image} alt="" />
            </div>
          </section>
          {children}
        </section>
      </section>
    </section>
  );
}

export default DefaultLayout;
