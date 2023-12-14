import { IconClose } from '@Components/icons/iconClose';
import { IconDotVertical } from '@Components/icons/iconDotVertical';
import useAuthentication from '@Hooks/useAuthentication';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './box.module.scss';
import stylesCommon from '@styles/commonStyle.module.scss';
import { HubConnectionBuilder } from '@microsoft/signalr';

export const Messages = ({ onClose, reciverId, avatar, name }) => {
  const { data } = useAuthentication();
  const [content, setContent] = useState();
  const [messages, setMessages] = useState([]);
  const [isOpenedModal, setIsOpenedModal] = useState();
  const [connection, setConnection] = useState(null);
  const ref = useRef();
  const refA = useRef();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || '';

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Message/get-message/${reciverId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    })
      .then((res) => res?.json())
      .then((res) => setMessages(res));
  }, []);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7194/chathub')
      .withAutomaticReconnect()
      .build();

    newConnection.on('ReceiveMessage', (...props) => {
      setMessages((prev) => [
        ...prev,
        {
          messageId: props[1],
          senderId: props[0],
          content: props[3],
        },
      ]);
      refA.current.scrollTo(0, refA.current.scrollHeight);
    });

    newConnection.start().then(() => {
      console.log('cai lz ma ');
      setConnection(newConnection);
      newConnection.invoke('SendMessageToGroup', data.userId).then(() => 'connect');
    });

    return () => {
      newConnection.stop();
    };
  }, []);
  useEffect(() => {
    refA.current.scrollTo(0, refA.current.scrollHeight);
  }, [messages]);
  return (
    <section className={clsx(styles['messagesBoxWrapper'])}>
      <section className={clsx(styles['boxWrapper'], 'boxWrapper')} tabIndex={1}>
        <div className={styles['boxTop']}>
          <div className="flex items-center cursor-default">
            <div className="relative">
              <Image
                height="32px"
                width="32px"
                src={avatar || defaultAvatar}
                className="rounded-full"
                alt=""
              />
            </div>
            <div className="ml-3">
              <span className="">{name}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div
              onClick={() => {
                onClose();
              }}
            >
              <IconClose className={styles['icon-control']} width="20px" height="20px" />
            </div>
          </div>
        </div>
        <div className={styles['boxMain']} ref={refA}>
          {messages.map((message) => (
            <div className={clsx(styles['boxMain-item'])} key={message?.messageId}>
              <div className={clsx(styles[message?.senderId === data?.userId ? 'you' : 'yourFriend'])}>
                <div>{message?.content}</div>
                {data?.userId === message.senderId && (
                  <div
                    className={styles['item-control']}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpenedModal((prev) =>
                        prev !== message?.messageId ? message?.messageId : undefined
                      );
                    }}
                  >
                    <IconDotVertical className={styles['icon']} />
                    {isOpenedModal === message?.messageId && (
                      <div
                        className={clsx(stylesCommon['modal'], stylesCommon['modal-second'], styles['modal'])}
                      >
                        <div
                          className={clsx(stylesCommon['modal-item'])}
                          onClick={() => {
                            const accessToken = localStorage.getItem('accessToken') || '';
                            fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/api/Message/delete-message/${message.messageId}`,
                              {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${accessToken}` },
                                credentials: 'include',
                              }
                            );
                            setMessages((prev) => prev.filter((m) => m.messageId !== message.messageId));
                          }}
                        >
                          <p className="ml-2">Delete</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <form
            ref={ref}
            className={styles['boxBottom']}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('content', content);
              const accessToken = localStorage.getItem('accessToken') || '';
              ref.current.reset();
              connection.invoke('SendMessage', accessToken, reciverId, reciverId, content);
            }}
          >
            <input
              className={styles['inp']}
              placeholder="Typing here..."
              onChange={({ target: { value } }) => {
                setContent(value);
              }}
            />
            <button className={styles['btn']}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="28px"
                width="28px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
              </svg>
            </button>
          </form>
        </div>
      </section>
    </section>
  );
};
