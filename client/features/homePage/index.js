import useAuthentication from '@Hooks/useAuthentication';
import { DeletePost, GetPosts, UpdatePost } from '@Apis/post.api';
import Contact from '../layout/components/Contact';
import SideBar from '../layout/components/Sidebar';
import styles from './homePage.module.scss';
import { useState, useEffect } from 'react';
import { TextInput } from '@Components/Input/TextInput';
import PostModal from '@Components/Modal/PostModal';
import Post from '@Components/Post';
import Image from 'next/image';

function HomePage() {
  const authentication = useAuthentication();
  const [posts, setPosts] = useState([]);

  const [isModal, setIsModal] = useState(false);
  useEffect(() => {
    GetPosts(0, 20).then((data) => {
      setPosts(data);
    });
  }, []);

  return (
    <div className={styles['main']}>
      <SideBar />
      <Contact />
      <main className={styles['wrapper']}>
        {isModal && (
          <PostModal
            title={'Create Post'}
            avatar={authentication.data?.avatar}
            _name={authentication.data?.fullname}
            exit={() => setIsModal((prev) => !prev)}
            onSave={(post) => {
              setPosts((prev) => [post, ...prev]);
              setIsModal(false);
            }}
          />
        )}
        <div className="w-[400px] mb-5 flex gap-2">
          <Image
            src={authentication.data?.avatar}
            alt=""
            width="40px"
            height="40px"
            className="rounded-full "
          />
          <TextInput
            editable={false}
            submit={() => {}}
            onClick={() => {
              setIsModal((prev) => !prev);
            }}
            className={styles['post-inp']}
            placeholder="What's on your mind?"
          />
        </div>
        <div className="w-full flex flex-col gap-5 pb-3 max-w-[600px]">
          {posts.map((post) => (
            <Post
              {...post}
              key={post.postId}
              onDelete={(id) => {
                setPosts((prev) => prev.filter((post) => post.postId !== id));
                DeletePost(id);
              }}
              onUpdate={(postId, payload) => {
                UpdatePost(postId, payload).then((res) => {
                  console.log(res);
                  setPosts((prev) =>
                    prev.map((post) => {
                      if (post.postId === postId) {
                        console.log(postId);
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
      </main>
    </div>
  );
}

export default HomePage;
