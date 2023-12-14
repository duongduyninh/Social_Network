import { Image } from '@Components/Image';
import Skeleton from '@Components/Skeleton';
import { extractColors } from 'extract-colors';
import { useEffect, useState } from 'react';
import styles from '../usersPage.module.scss';
import stylesTop from './top.module.scss';

function TopPage({ _name, avatar, background_img, disabled = true }) {
  const [backgournd, setBackgournd] = useState(background_img);
  const [ava, setAva] = useState(avatar);
  const [bg, setBg] = useState([]);

  useEffect(() => {
    if (backgournd) {
      let src = backgournd;
      if (typeof backgournd === 'object') {
        src = backgournd.src;
      }
      extractColors(src, { crossOrigin: 'anonymous', distance: 0.47 }).then((src) =>
        setBg(src.map((color) => color.hex))
      );
    }
  }, [backgournd]);

  useEffect(() => {
    setAva(avatar);
    setBackgournd(background_img);
  }, [avatar, backgournd]);

  return (
    <>
      <div className={stylesTop['top']}>
        <div
          style={{
            background: `linear-gradient(${bg.join(',')})`,
          }}
        >
          <div className={styles['background']}>
            {backgournd ? (
              <Image
                src={backgournd}
                alt=""
                objectFit="fill"
                width="1280px"
                height="450px"
                disabled={disabled}
                onChange={(e) => {
                  const target = e.target;
                  const files = target.files;
                  setBackgournd(URL.createObjectURL(files[0]));
                  const accessToken = localStorage.getItem('accessToken') || '';
                  const formData = new FormData();
                  formData.append('Coverphoto', files[0]);
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/updateProfile-user`, {
                    method: 'PUT',
                    body: formData,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    credentials: 'include',
                  });
                }}
                change
              />
            ) : (
              <Skeleton type="default" height="450px" width="1280px" />
            )}
          </div>
        </div>
        <div className={styles['wrapper-avatar']}>
          <div className={stylesTop['avatar']}>
            {ava ? (
              <Image
                src={ava}
                alt=""
                className="rounded-full"
                layout="fill"
                height="100%"
                width="100%"
                disabled={disabled}
                onChange={(e) => {
                  const target = e.target;
                  const files = target.files;
                  setAva(URL.createObjectURL(files[0]));
                  const accessToken = localStorage.getItem('accessToken') || '';
                  const formData = new FormData();
                  formData.append('Avatar', files[0]);
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/updateProfile-user`, {
                    method: 'PUT',
                    body: formData,
                    headers: { Authorization: `Bearer ${accessToken}` },
                    credentials: 'include',
                  });
                }}
                change
              />
            ) : (
              <Skeleton type="img" height="150px" width="150px" />
            )}
          </div>
          <div>
            <p className={styles['name']}>{_name}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopPage;
