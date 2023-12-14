import FetchData from 'Apis';

export async function GetNotifications() {
  const accessToken = localStorage.getItem('accessToken') || '';

  const res = await FetchData.get(`/api/Notify/get-notify`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return await res.json();
}
