import Button from '@Components/Button';
import { Image } from '@Components/Image';
import { TextInput } from '@Components/Input/TextInput';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import { memo, useCallback, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import ImagesComponent from './Components/Images';
import styles from './PostModal.module.scss';
import { CreatePost } from '@Apis/post.api';

function PostModal({ title, _postsId, _content, _images, _userId, avatar, _name, exit, onSave, onUpdate }) {
  const [images, setImages] = useState([]);
  const oldImages = useRef([]);
  const [previewImages, setPreviewImages] = useState(_images || []);
  const [content, setContent] = useState(_content);
  const handleImages = useCallback((files) => {
    setImages(files);
  }, []);
  const handleDeleteImage = useCallback((index, oldImage) => {
    oldImages.current.push(oldImage);
    setImages((prev) => {
      return prev.filter((file, i) => {
        if (i !== index) {
          return true;
        } else {
          return false;
        }
      });
    });
  }, []);
  const handlePost = () => {
    const formData = new FormData();
    formData.append('Content', content);
    images.map((image) => {
      formData.append('ImageFiles', image);
    });
    if (onSave) {
      CreatePost(formData).then((res) => onSave(res));
    } else {
      oldImages.current.map((image) => {
        formData.append('ImagesLinkRemove', image);
      });
      onUpdate(formData);
    }
  };
  const ref = useRef(null);

  return (
    <div className={clsx(styles['wrapper'])}>
      <div className={clsx(styles['modal'])}>
        <IoMdClose className={styles['icon-close']} onClick={exit} />
        <div className={styles['modal_bg']}>
          <div className={styles['modal_image']}>
            <p className={styles['title']}>{title}</p>
            <Button className={styles['btn']} padding="0" onClick={() => handlePost()}>
              Share
            </Button>
          </div>
          <div className={styles['modal_content']}>
            <ImagesComponent
              handleSetImages={handleImages}
              handleDeleteImage={handleDeleteImage}
              _images={previewImages}
            />
            <div className={styles['container']}>
              <div className="top flex flex-col h-full">
                <div className="flex" >
                  <div className={styles['image']}>
                    <Image
                      src={avatar || defaultAvatar}
                      alt=""
                      className="rounded-full"
                      width="28px"
                      height="28px"
                    />
                  </div>
                  <p className="lg:text-lg">{_name}</p>
                </div>
                <div className="flex-1 mt-5  max-h-full">
                  <TextInput
                    ref={ref}
                    className={styles['input']}
                    reset={false}
                    handleChange={(content) => {
                      setContent(content);
                    }}
                    placeholder="What's on your mind?"
                    submit={() => handlePost()}
                    content={_content}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 w-screen h-screen bg-[#00000078]"></div>
    </div>
  );
}

export default memo(PostModal);
