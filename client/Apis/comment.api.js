import FetchData from 'Apis';
export async function GetComments(postId) {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await FetchData.get(`/api/Comment/list-comment/${postId}`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await res.json();
}

export async function CreateComments(postId, content) {
  const accessToken = localStorage.getItem('accessToken') || '';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Comment/${postId}`, {
    method: 'POST',
    body: content,
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
  return await res.json();
}
export async function DeleteComment(postId, commentId) {
  const accessToken = localStorage.getItem('accessToken') || '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/Comment/delete-comment/${postId}/${commentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    }
  );
}
export async function EditComment(commentId, content) {
  const accessToken = localStorage.getItem('accessToken') || '';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Comment/update-comment/${commentId}`, {
    method: 'PUT',
    body: content,
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  });
}
