import defaultAvatar from '@public/images/defaultAvatar.png';
import Image from 'next/image';
import { memo } from 'react';
import styles from './contact.module.scss';
import { useEffect, useState } from 'react';

function Contact() {
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/listPending-friendships`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => setFriends(res));
  }, []);

  return (
    <div className={styles['wrapper']}>
      <div className={styles['top']}>
        <p className="font-bold pr-5">Friend request</p>
      </div>
      <div className="flex-colum pt-10 text-white">
        {friends?.map((user) => (
          <div
            className="flex hover-1  items-center gap-5 p-4 hover:bg-[#ffffff1a] rounded-md cursor-pointer transition-all duration-300"
            key={user.userId}
          >
            <div className="relative w-[36px] h-[36px]">
              <Image
                src={user?.avatar ?? defaultAvatar}
                width="100%"
                height="100%"
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <p style={{color: "#677483"}}> {user.fullname}</p>
              <div className="flex gap-3 w-full">
                <button
                  className={styles['btn_confirm']}
                  onClick={() => {
                    const accessToken = localStorage.getItem('accessToken') || '';
                    fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/accept-friendships/${user?.friendShipId}`,
                      {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${accessToken}` },
                        credentials: 'include',
                      }
                    );
                    setFriends((prev) => prev.filter((n) => n.userId !== user.userId));
                  }}
                >
                 Confirm
                </button>
                <button
                  className={styles['btn_delete']}
                  onClick={() => {
                    const accessToken = localStorage.getItem('accessToken') || '';
                    setFriends((prev) => prev.filter((n) => n.userId !== user.userId));
                    fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/reject-friendships/${user?.friendShipId}`,
                      {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${accessToken}` },
                        credentials: 'include',
                      }
                    );
                  }}
                >
                 Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Contact);
