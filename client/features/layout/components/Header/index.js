import { useDebounce } from '@Hooks/useDebounce';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { SearchInput } from '../../../../Components/Input/SearchInput';
import { IconFacebook } from '../../../../Components/icons/iconFacebook';
import { IconSearch } from '../../../../Components/icons/iconSearch';
import { BsBellFill } from 'react-icons/bs';
import defaultAvatar from '@public/images/defaultAvatar.png';
import styles from './header.module.scss';
import clsx from 'clsx';
import { Image } from '@Components/Image';
import moment from 'moment';
import { RiSendPlaneFill } from 'react-icons/ri';
import { GetNotifications } from '@Apis/notifications.qpi';
import { Messages } from '@Components/Messages';
import image from '../../../../public/images/logo-dia-cau-doc_090708690.png';


function Header() {
  const { debounce } = useDebounce();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [people, setPeople] = useState([]);
  const containerParent = useRef(null);
  const router = useRouter();
  const [isAnnounce, setIsAnnounce] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [notifi, setNotifi] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState();

  useEffect(() => {
    GetNotifications().then((res) => setNotifi(res));
    const accessToken = localStorage.getItem('accessToken') || '';
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Conversation/get-conversation`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => setMessages(res));
  }, []);

  return (
    <>
      <section className={styles['wrapper']}>
        <div className={styles['colLeft']}>
          <div className="flex items-center flex-1">
            <Link href="/">
              <a>
                 <Image width="72px" height = "62px"  src={image} alt="" />
              </a>
            </Link>
            <div className={styles['wrapper-input']} ref={containerParent}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <SearchInput
                  icon={<IconSearch width="18px" height="18px" />}
                  placeholder="Search"
                  className={styles['input']}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (e.currentTarget.value) {
                        router.push({ pathname: '/Search/People', query: { q: e.currentTarget.value } });
                      }
                    }
                  }}
                />
              </form>
              {isOpenModal && (
                <div className={styles['search_table']}>
                  {people?.length ? (
                    people.map((user, idx) => (
                      <Link href={'/'} key={idx}>
                        <a className={styles['item']} color = "aliceblue">
                          <Image
                            src={defaultAvatar}
                            alt=""
                            width="38px"
                            height="38px"
                            className={styles['img']}
                          />
                          <p className={styles['content']}>name</p>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <p>There were no results found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles['colRight']}>
          <div className="ml-[10px]">
            <div
              className={clsx(styles['bell'])}
              onClick={() => {
                setIsMessage((prev) => !prev);
                setIsAnnounce(false);
              }}
            >
              <RiSendPlaneFill />
            </div>
            {isMessage && (
              <section className={styles['messagesNotifications_wrapper']} draggable="false">
                <h1 className={styles['h1']}>Chats</h1>
                <section className={styles['notifications']}>
                  {messages?.map((message) => (
                    <div
                      className={clsx(styles['item'])}
                      key={message?.conversationId}
                      onClick={() => {
                        setIsMessage();
                        setChats({
                          avatar: message.avatar,
                          fullname: message.recipientName,
                          id: message.recipientId,
                        });
                      }}
                    >
                      <div className={styles['image']}>
                        <Image
                          src={message?.avatar || defaultAvatar}
                          alt=""
                          width="73px"
                          height="73px"
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div>
                          <div className={styles['content']}>
                            <p className={styles['name']}>{message?.recipientName}</p>
                            <span className={clsx(styles['contentOfMessages'], 'flex-1 ml')}>
                              {message?.lastMessage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </section>
            )}
          </div>
          <div className="ml-[10px]">
            <div
              className={clsx(styles['bell'])}
              onClick={() => {
                setIsMessage(false);
                setIsAnnounce((prev) => !prev);
              }}
            >
              <BsBellFill />
            </div>
            {isAnnounce && (
              <section className={styles['notifications_wrapper']} draggable="false">
                <h1 className={styles['h1']}>Notifications</h1>
                <section className={styles['notifications']}>
                  {notifi.map((noti, i) => (
                    <div className={clsx(styles['item'])} key={noti?.notifyId}>
                      <div className={styles['image']}>
                        <Image
                          src={noti?.avatar || defaultAvatar}
                          alt=""
                          width="73px"
                          height="73px"
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex">
                          <p className={styles['content']}>{noti?.notifyContent}</p>
                        </div>
                        {noti.notifyType === 'friend_request' && (
                          <div className="flex gap-3">
                            <button
                              className={styles['btn_confirm']}
                              onClick={() => {
                                const accessToken = localStorage.getItem('accessToken') || '';
                                fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/accept-friendships/${noti?.friendShipId}`,
                                  {
                                    method: 'PUT',
                                    headers: { Authorization: `Bearer ${accessToken}` },
                                    credentials: 'include',
                                  }
                                );
                                setNotifi((prev) =>
                                  prev.map((n) => {
                                    if (n.notifyId === noti.notifyId) {
                                      n.notifyType = '';
                                    }
                                    return n;
                                  })
                                );
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              className={styles['btn_delete']}
                              onClick={() => {
                                const accessToken = localStorage.getItem('accessToken') || '';
                                setNotifi((prev) =>
                                  prev.map((n) => {
                                    if (n.notifyId === noti.notifyId) {
                                      n.notifyType = '';
                                    }
                                    return n;
                                  })
                                );
                                fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL}/api/Friend/reject-friendships/${noti?.friendShipId}`,
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
                        )}
                        <p className={clsx(styles['time'])}>
                          {moment(
                            moment(noti?.notifyTime).format('YYYYMMDD hh:mm:ss a'),
                            'YYYYMMDD HH:mm:ss a'
                          ).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>
              </section>
            )}
          </div>
        </div>
      </section>
      {chats && (
        <Messages
          avatar={chats?.avatar}
          name={chats?.fullname}
          onClose={() => {
            setChats();
          }}
          reciverId={chats?.id}
        />
      )}
    </>
  );
}

export default Header;
