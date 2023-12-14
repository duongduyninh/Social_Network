import useAuthentication from '@Hooks/useAuthentication';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './people.module.scss';
import Link from 'next/link';

const PeoplePage = () => {
  const router = useRouter();
  const Authentication = useAuthentication();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const userName = router.query?.q;
    if (userName) {
      const formData = new FormData();
      formData.append('keyword', userName);
      const accessToken = localStorage.getItem('accessToken') || '';
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Search/`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => setUsers(res));
    }
  }, [router.query]);

  return (
    <main className={styles['main']}>
      <section className={styles['container']}>
        {users.map((user) => (
          <Link href={`/${user.userId}`} key={user.userId}>
            <a>
              <div className={clsx(styles['item'], 'flex justify-between')}>
                <div className="flex items-center">
                  <Image
                    src={user.avatar || defaultAvatar}
                    alt=""
                    width="68px"
                    height="68px"
                    className={styles['img']}
                  />
                  <p className={styles['name']}>{user.fullname}</p>
                </div>
                {user.userId !== Authentication.data?.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (user.friendStatus === undefined || user.friendStatus === 2) {
                          const accessToken = localStorage.getItem('accessToken') || '';
                          fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/add-friendships/${user.userId}`,
                            {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${accessToken}` },
                              credentials: 'include',
                            }
                          )
                            .then((res) => res.json())
                            .then((res) => {
                              setUsers((prev) =>
                                prev.map((u) => {
                                  if (u.userId === user.userId) {
                                    u.reciverFriendResquest = res.reciverFriendResquest;
                                    u.senderFriendResquest = res.senderFriendResquest;
                                    u.friendStatus = 0;
                                    u.friendShipId = res.friendShipId;
                                  }
                                  return u;
                                })
                              );
                            });
                        } else if (
                          user.friendStatus === 0 &&
                          user.reciverFriendResquest === Authentication.data?.userId
                        ) {
                          const accessToken = localStorage.getItem('accessToken') || '';
                          fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/accept-friendships/${user.friendShipId}`,
                            {
                              method: 'PUT',
                              headers: { Authorization: `Bearer ${accessToken}` },
                              credentials: 'include',
                            }
                          );
                          setUsers((prev) =>
                            prev.map((u) => {
                              if (u.userId === user.userId) {
                                u.friendStatus = 1;
                              }
                              return u;
                            })
                          );
                        }
                      }}
                    >
                      {user.friendStatus === 0 &&
                        user.reciverFriendResquest === Authentication.data?.userId && (
                          <div className={styles['btn_confirm']}>Confirm</div>
                        )}
                      {user.friendStatus === 1 && (
                        <div
                          className={styles['btn_confirm']}
                        >
                          Friend
                        </div>
                      )}
                      {user.friendStatus === 2 && <div className={styles['btn_confirm']}>Add Friend</div>}
                    </button>
                    <button
                      onClick={() => {
                        const accessToken = localStorage.getItem('accessToken') || '';

                        if (user.friendStatus === 1) {
                          fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/remove-friendships/${user.userId}`,
                            {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${accessToken}` },
                              credentials: 'include',
                            }
                          );
                          setUsers((prev) =>
                            prev.map((u) => {
                              if (u.userId === user.userId) {
                                u.friendStatus = 2;
                              }
                              return u;
                            })
                          );
                          return;
                        }
                        let id = user.reciverFriendResquest;
                        let t = 'revoke';
                        if (
                          user.friendStatus === 0 &&
                          user.reciverFriendResquest === Authentication.data?.userId
                        ) {
                          id = friendShipId;
                          t = 'reject';
                        }
                        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/${t}-friendships/${id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${accessToken}` },
                          credentials: 'include',
                        });
                        setUsers((prev) =>
                          prev.map((u) => {
                            if (u.userId === user.userId) {
                              u.friendStatus = 2;
                            }
                            return u;
                          })
                        );
                        setFriendStatus(2);
                      }}
                    >
                      {user.friendStatus === 0 &&
                        user.senderFriendResquest === Authentication.data?.userId && (
                          <div className={styles['btn_delete']}>Revoke</div>
                        )}
                      {user.friendStatus === 0 &&
                        user.reciverFriendResquest === Authentication.data?.userId && (
                          <div className={styles['btn_delete']}>Cancel</div>
                        )}
                      {user.friendStatus === 1 && <div className={styles['btn_delete']}>UnFriend</div>}
                    </button>
                  </div>
                )}
              </div>
            </a>
          </Link>
        ))}
      </section>
    </main>
  );
};
export { PeoplePage };
