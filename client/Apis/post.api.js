import FetchData from 'Apis';

async function GetPosts(skip, take) {
  const accessToken = localStorage.getItem('accessToken') || '';

  const res = await FetchData.get(`/api/Post/get-post?skip=${skip}&take=${take}`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await res.json();
}
export { GetPosts };

async function CreatePost(payload) {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Post/add-post`, {
    method: 'POST',
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  return await res.json();
}
export { CreatePost };

async function DeletePost(postId) {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Post/delete-post/${postId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  return await res.json();
}
export { DeletePost };

async function UpdatePost(postId, payload) {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Post/update-post/${postId}`, {
    method: 'PUT',
    body: payload,
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });

  return await res.json();
}
export { UpdatePost };

export async function CreateReaction(type, postId) {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Like/${postId}`, {
    method: 'PUT',
    body: type,
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
}
