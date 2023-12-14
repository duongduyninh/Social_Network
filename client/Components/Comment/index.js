import { GetComments, CreateComments, DeleteComment, EditComment } from '@Apis/comment.api';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { IconBars } from '@Components/icons/iconBars';
import styles from './comment.module.scss';
import useAuthentication from '@Hooks/useAuthentication';
const Comment = ({ postId, setDelete }) => {
  const [comments, setComments] = useState([]);
  const { data } = useAuthentication();
  const [content, setContent] = useState();
  const [i, setI] = useState();
  const [iEdit, setIEdit] = useState();
  const ref = useRef();
  useEffect(() => {
    GetComments(postId).then((res) => setComments(res));
  }, []);
  return (
    <>
      <div className={styles['wrapper']}>
        <div className="self-start">
          <Image src={data.avatar} alt="" height="32px" width="32px" className="rounded-full " />
        </div>

        <div className="flex-1 ml-2">
          <form
            ref={ref}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append('content', content);
              ref.current.reset();
              CreateComments(postId, formData).then((res) => setComments((prev) => [res, ...prev]));
            }}
          >
            <input
              placeholder="Comment"
              className={styles['input']}
              onChange={({ target: { value } }) => {
                setContent(value);
              }}
            />
          </form>
        </div>
      </div>

      {comments.map((comment, index) => (
        <div className={clsx(styles['wrapper'], 'mt-6')} key={index}>
          <div className="flex">
            <div className="self-start">
              <Image
                src={comment?.avatar ?? defaultAvatar}
                alt=""
                height="32px"
                width="32px"
                className="rounded-full "
              />
            </div>
            <div className="flex-1 ml-2 text-sm">
              <div className={styles['comment']}>
                <p className={styles['comment-userName']}>{comment.fullname}</p>
                {iEdit === index ? (
                  <div className="flex justify-between items-center w-full">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setComments((prev) =>
                          prev.map((c) => {
                            if (c.commentId === comment.commentId) {
                              c.content = content;
                            }
                            return c;
                          })
                        );
                        const formData = new FormData();
                        formData.append('content', content);
                        setIEdit(false);
                        EditComment(comment.commentId, formData);
                      }}
                      className="w-full"
                    >
                      <input
                        defaultValue={comment.content}
                        className={clsx(styles['input'])}
                        onChange={({ target: { value } }) => {
                          setContent(value);
                        }}
                      />
                    </form>
                    <p onClick={() => setIEdit(-1)}>Cancel</p>
                  </div>
                ) : (
                  <p className="text-[14px]">{comment.content}</p>
                )}
              </div>
            </div>
            <div className={styles['icon-wrapper']}>
              <div
                className={styles['iconBars']}
                style={{
                  zIndex: '50',
                }}
                onClick={(e) => {
                  setI((prev) => {
                    if (prev === index) {
                      return -1;
                    }
                    return index;
                  });
                }}
              >
                <IconBars />
              </div>
              {i === index && (
                <div className={clsx(styles['menuControl'])}>
                  <p
                    className={styles['menuControl-item']}
                    onClick={() => {
                      setIEdit(index);
                      setI();
                    }}
                  >
                    Edit
                  </p>
                  <p
                    className={styles['menuControl-item']}
                    onClick={() => {
                      setComments((prev) => prev.filter((c) => c.commentId !== comment.commentId));
                      DeleteComment(postId, comment.commentId);
                      setDelete();
                    }}
                  >
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export { Comment };
