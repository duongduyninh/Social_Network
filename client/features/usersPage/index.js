import { DeletePost, UpdatePost } from '@Apis/post.api';
import Post from '@Components/Post';
import useAuthentication from '@Hooks/useAuthentication';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TopPage from './Top';
import styles from './usersPage.module.scss';
import { Messages } from '@Components/Messages';
import Link from 'next/link';
import Image from 'next/image';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';

function UsersPage() {
  const router = useRouter();
  const Authentication = useAuthentication({});
  const userName = router.query.userName;
  const [user, setUser] = useState();
  const [isModal, setIsModal] = useState(false);
  const [friendStatus, setFriendStatus] = useState(user?.friendStatus);
  const [posts, setPosts] = useState([]);
  const [reciverFriendResquest, setReciverFriendResquest] = useState();
  const [senderFriendResquest, setSenderFriendResquest] = useState();
  const [friendShipId, setFriendShipId] = useState();
  const [isMessage, setIsMessage] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    if (userName) {
      const accessToken = localStorage.getItem('accessToken') || '';

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/getProfile-user/${userName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Post/getPostOfUser/${userName}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}` },
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((res) => {
              setPosts(res);
            });
          setFriendStatus(res.friendStatus);
          setFriendShipId(res.friendShipId);
          setReciverFriendResquest(res.reciverFriendResquest);
          setSenderFriendResquest(res.senderFriendResquest);
            
          console.log(res);
          setUser(res);
        });
    }
  }, [userName]);
// console.log(posts);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';
    if (userName) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/list-friendships/${userName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => setFriendsList(res));
    }
  }, [userName]);

  return (
    <>
      <main className={styles['wrapper']}>
        {user?.avatar && (
          <TopPage
            _name={user?.fullname}
            _userId={user?.userId}
            avatar={user?.avatar}
            background_img={user?.coverPhoto}
            disabled={Authentication.data?.userId !== user?.userId ? true : false}
          />
        )}
        {friendStatus !== undefined && friendStatus !== -1 && (
          <div className="flex gap-3 justify-center mb-5">
            <button
              onClick={() => {
                if (friendStatus === undefined || friendStatus === 2) {
                  const accessToken = localStorage.getItem('accessToken') || '';
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/add-friendships/${userName}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    credentials: 'include',
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      setFriendShipId(res.friendShipId);
                      setReciverFriendResquest(res.reciverFriendResquest);
                      setSenderFriendResquest(res.senderFriendResquest);
                      setFriendStatus(0);
                    });
                } else if (friendStatus === 0 && reciverFriendResquest === Authentication.data?.userId) {
                  const accessToken = localStorage.getItem('accessToken') || '';
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/accept-friendships/${friendShipId}`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    credentials: 'include',
                  });
                  setFriendStatus(1);
                }
              }}
            >
              {friendStatus === 0 && reciverFriendResquest === Authentication.data?.userId && (
                <div className={styles['btn_confirm']}>Confirm</div>
              )}
              {friendStatus === 2 && <div className={styles['btn_confirm']}>Add Friend</div>}
            </button>

            {friendStatus === 1 && (
              <button
                className={styles['btn_confirm']}
                onClick={() => {
                  setIsMessage(true);
                }}
              >
                Chat
              </button>
            )}

            <button
              onClick={() => {
                const accessToken = localStorage.getItem('accessToken') || '';

                if (friendStatus === 1) {
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/remove-friendships/${userName}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    credentials: 'include',
                  });
                  setFriendStatus(2);
                  return;
                }
                let id = reciverFriendResquest;
                let t = 'revoke';
                if (friendStatus === 0 && senderFriendResquest === userName) {
                  id = friendShipId;
                  t = 'reject';
                }
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Friend/${t}-friendships/${id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${accessToken}` },
                  credentials: 'include',
                });
                setFriendStatus(2);
              }}
            >
              {friendStatus === 0 && reciverFriendResquest === userName && (
                <div className={styles['btn_delete']}>revoke</div>
              )}
              {friendStatus === 0 && senderFriendResquest === userName && (
                <div className={styles['btn_delete']}>Cancel</div>
              )}
              {friendStatus === 1 && <div className={styles['btn_delete']}>Unfriend</div>}
            </button>
          </div>
        )}
        <div className="flex flex-col gap-5 lg:flex-row justify-center">
          <div className={styles['main']}>
            <section>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Friends ( {friendsList.length} )</p>
                </div>
              </div>
              <section className={styles['friendsContainer']}>
                {friendsList.map((friend, index) => (
                  <Link key={friend._userId} href={`/${friend.userId}`}>
                    <a>
                      <section className={styles['item']}>
                        <div className={clsx(styles['img'], 'flex-1')}>
                          <Image
                            src={friend.avatar || defaultAvatar}
                            alt=""
                            width="100%"
                            height="100%"
                            layout="responsive"
                            className="rounded-md flex-1"
                          />
                        </div>
                        <p className={styles['name_list']}>{friend.fullname}</p>
                      </section>
                    </a>
                  </Link>
                ))}
              </section>
            </section>
          </div>

          <div className="bottom items-center flex flex-col justify-start lg:pt-0">
            <div className="w-full  flex flex-col gap-5 pb-3 md:w-[600px]">
              {posts.map((post) => (
                <Post
                  key={post.postId}
                  {...post}
                  onDelete={(id) => {
                    setPosts((prev) => prev.filter((post) => post.postId !== id));
                    DeletePost(id);
                  }}
                  onUpdate={(postId, payload) => {
                    UpdatePost(postId, payload).then((res) => {
                      setPosts((prev) =>
                        prev.map((post) => {
                          if (post.postId === postId) {
                            post = res;
                          }
                          return post;
                        })
                      );
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      {isMessage && (
        <Messages
          avatar={user?.avatar}
          name={user?.fullname}
          onClose={() => {
            setIsMessage(false);
          }}
          reciverId={userName}
        />
      )}
    </>
  );
}

export default UsersPage;
