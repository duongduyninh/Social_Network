import { Image } from '@Components/Image';
import PostModal from '@Components/Modal/PostModal';
import { ZoomImage } from '@Components/ZoomImage';
import { IconLike } from '@Components/icons/ReactIcon/iconLike';
import useAuthentication from '@Hooks/useAuthentication';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import moment from 'moment';
import { memo, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegCommentAlt } from 'react-icons/fa';
import MenuControl from './components/MenuControl';
import style from './post.module.scss';
import { IconAngry } from '@Components/icons/ReactIcon/iconAngry';
import { IconCare } from '@Components/icons/ReactIcon/iconCare';
import { IconHaha } from '@Components/icons/ReactIcon/iconHaha';
import { IconLove } from '@Components/icons/ReactIcon/iconLove';
import { IconSad } from '@Components/icons/ReactIcon/iconSad';
import { IconWow } from '@Components/icons/ReactIcon/iconWow';
import { Comment } from '@Components/Comment';
import { CreateReaction } from '@Apis/post.api';
import Link from 'next/link';
const width = '36px';
const icons = [
  { icon: <IconLike width={width} />, type: 0 },
  { icon: <IconLove width={width} />, type: 1 },
  { icon: <IconCare width={width} />, type: 2 },
  { icon: <IconHaha width={width} />, type: 3 },
  { icon: <IconWow width={width} />, type: 4 },
  { icon: <IconSad width={width} />, type: 5 },
  { icon: <IconAngry width={width} />, type: 6 },
];

const iconList = {
  0: {
    icon: <IconLike width="18px" />,
    content: 'like',
  },
  1: {
    icon: <IconLove width="18px" />,
    content: 'love',
  },
  2: {
    icon: <IconCare width="18px" />,
    content: 'care',
  },
  3: {
    icon: <IconHaha width="18px" />,
    content: 'haha',
  },
  4: {
    icon: <IconWow width="18px" />,
    content: 'wow',
  },
  5: {
    icon: <IconSad width="18px" />,
    content: 'sad',
  },
  6: {
    icon: <IconAngry width="18px" />,
    content: 'angry',
  },
};

function Post({
  postId,
  totalReact,
  totalComment,
  postTime,
  images,
  content,
  user,
  onDelete,
  onUpdate,
  react: reactProps,
}) {
  const [isMenu, setIsMenu] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [isOpenCmt, setIsOpenCmt] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const { data } = useAuthentication();
  const [reaction, setReaction] = useState(iconList[reactProps]?.icon || undefined);
  const [tComment, setTComment] = useState(totalComment);
  const [typeReaction, setTypeReaction] = useState({
    content: iconList[reactProps]?.content,
    type: reactProps,
  });
  const isYou = data?.userId === user.userId;
  const [isHover, setIsHover] = useState(false);
  const [react, setReact] = useState(totalReact || 0);
  const handleCreateReaction = (type) => {
    const formData = new FormData();
    formData.append('react', type);
    CreateReaction(formData, postId);
  };
console.log(typeReaction);
console.log(reactProps);

  const handleShowComment = () => {
    setIsOpenCmt(true);
  };

  const handleShowMenu = (state) => {
    setIsMenu(state);
  };

  return (
    <>
      <section>
        <div className={style['wrapper']}>
          <div className={style['user']}>
            <div className="flex">
              <div className="mr-3">
                <Image
                  src={user?.avatar || defaultAvatar}
                  alt=""
                  height="40px"
                  width="40px"
                  className="rounded-full"
                />
              </div>
              <div>
                <Link href={`/${user.userId}`}>
                  <a>
                    <p className="hover:underline cursor-pointer inline">{user?.fullname}</p>
                  </a>
                </Link>
                <p className={style['day']}>
                  {moment(moment(postTime).format('YYYYMMDD hh:mm:ss a'), 'YYYYMMDD HH:mm:ss a').fromNow()}
                </p>
              </div>
            </div>
            {isYou ? (
              <div className="relative mt-3" tabIndex={-1}>
                <BsThreeDots
                  className={style['bars']}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowMenu(!isMenu);
                  }}
                />
                {(isMenu && (
                  <MenuControl
                    handleDelete={() => {
                      onDelete(postId);
                    }}
                    id={postId}
                    handleShowMenu={handleShowMenu}
                    handleShowPost={() => setIsPost((prev) => !prev)}
                  />
                )) ||
                  null}
              </div>
            ) : null}
          </div>
          <p className="px-4 pt-1 text-sm">{content}</p>
          {images?.length ? (
            <div className={style[`container-image-${images.length >= 5 ? 'grid' : 'flex'}`]}>
              {images.map((image, index) => {
                if (!image) return null;
                if (index >= 5) {
                  return null;
                }
                return (
                  <div
                    key={index}
                    className={clsx(style[`image-${images.length >= 5 ? 'grid' : 'flex'}`], 'relative')}
                    onClick={() => {
                      setShowImages(true);
                    }}
                  >
                    {images.length > 6 && index === 4 ? (
                      <div className={style['overlay']} data-number={images.length}></div>
                    ) : null}
                    <Image
                      src={image}
                      className="object-cover"
                      layout="responsive"
                      width="100%"
                      height="100%"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
          <div className={style['wrapper-interact']}>
            <div className={style['main']}>
              <div className="flex items-center cursor-pointer hover:underline ">
                <IconLike width="18px" height="18px" />
                <div className={style['p']}> {react}</div>
              </div>
              <div className="pointer-events-none">
                <p>{tComment} Comments</p>
              </div>
            </div>
            <div className={style['interact']}>
              <div
                className={clsx(style['interact-control'], style['icon_like'])}
                onClick={() => {
                  if (typeReaction?.type !== undefined) {
                    setReaction();
                    setTypeReaction();
                    handleCreateReaction(7);
                    setReact((prev) => prev - 1);
                  } else {
                    setReaction(iconList[0].icon);
                    setTypeReaction({
                      content: iconList[0].content,
                      type: 0,
                    });
                    setReact((prev) => prev + 1);
                    handleCreateReaction(0);
                  }
                }}
                onMouseMove={() => {
                  setIsHover(true);
                }}
                onMouseLeave={() => {
                  setIsHover(false);
                }}
              >
                {reaction || <AiOutlineLike />}
                <p>{typeReaction?.content || 'like'}</p>
                {isHover && (
                  <section
                    className={style['wrapper_icon_reaction']}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {icons.map(({ icon, type }, index) => (
                      <div
                        key={index}
                        className={style['icon']}
                        onClick={(e) => {
                          if (typeReaction?.type === type && type!==7) {
                            setReaction();
                            setTypeReaction();
                            handleCreateReaction(7);
                            setReact((prev) => prev - 1);
                          } else {
                            setReaction(iconList[type].icon);
                            setTypeReaction({
                              content: iconList[type].content,
                              type,
                            });
                            setReact((prev) => prev + 1);
                            handleCreateReaction(type);
                          }
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                    <IconLike />
                  </section>
                )}
              </div>
              <div className={style['interact-control']} onClick={handleShowComment}>
                <FaRegCommentAlt />
                <p>Comment</p>
              </div>
            </div>
            {isOpenCmt && <Comment postId={postId} setDelete={() => setTComment((prev) => prev - 1)} />}
          </div>
        </div>
      </section>
      {isPost ? (
        <PostModal
          title="Edit post"
          _postsId={postId}
          _content={content}
          _images={images}
          avatar={user.avatar}
          _name={user.fullname}
          exit={() => setIsPost((prev) => !prev)}
          onUpdate={(payload) => {
            setIsPost(false);
            onUpdate(postId, payload);
          }}
        />
      ) : null}
      {showImages ? <ZoomImage images={images} cb={() => setShowImages(false)} /> : null}
    </>
  );
}

export default memo(Post);
