import { LogOut } from '@Apis/authentication.api';
import { Image } from '@Components/Image';
import Skeleton from '@Components/Skeleton';
import useAuthentication from '@Hooks/useAuthentication';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import Link from 'next/link';
import { queryClient } from 'pages/_app';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './sideBar.module.scss';
import { IconLogout } from '../../../../Components/icons/iconLogout';


function SideBar({ handleOpenBar, widthMobile }) {
  const { data, ...props } = useAuthentication();

  const [subInfo, setSubInfo] = useState();
  const handleLogOut = async () => {
    queryClient.setQueryData(['authentication'], {});
    LogOut();
  };

  return (
    <>
      <div className={styles['wrapper']}>
        {widthMobile && (
          <>
            <div className="flex justify-end p-4 text-lg">
              <AiOutlineClose onClick={handleOpenBar} />
            </div>
          </>
        )}
        <div className="py-8 pt-[56px]">
          <div className={styles['user']}>
            <div className={styles['info']}>
              <div className="mb-4">
                {!props.isLoading ? (
                  <Link href={`/${data?.userId}`} passHref>
                    <a>
                      <Image
                        src={data?.avatar ?? defaultAvatar}
                        alt=""
                        width="84px"
                        height="84px"
                        className="rounded-full"
                      />
                    </a>
                  </Link>
                ) : (
                  <Skeleton type="img" width="84px" height="84px" />
                )}
              </div>
              <p>{data?.fullname}</p>
            </div>
            {/* <div className={styles['social']}>
              <div className={styles['social-item']}></div>
            </div> */}
          </div>
          <div className={styles['nav']}>
            <a href={`/${data?.userId}`} > 
              <div className={clsx(styles['link'], 'cursor-pointer')} >
              &#9432; Info
              </div>
            </a>
          </div>

          <div className={styles['nav']}>
            <div className={clsx(styles['link'], 'cursor-pointer')} onClick={() => handleLogOut()}>
              {"\u21A9"} Log Out
            </div>
          </div>
          
        </div>
      </div>
      {widthMobile && <div id="modal-overlay" className="fixed top-0 w-screen h-screen bg-[#00000078]"></div>}
    </>
  );
}

export default SideBar;
