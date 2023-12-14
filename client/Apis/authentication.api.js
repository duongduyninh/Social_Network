import FetchData from 'Apis';

export async function Login(payload) {
  const res = await FetchData.post('/api/Account/login', payload, { credentials: 'include' });
  return await res.json();
}
export async function LogOut() {
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const accessToken = localStorage.getItem('accessToken') || '';
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return FetchData.post(
    '/api/Account/logout ',
    { refreshToken },
    {
      credentials: 'include',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}
export async function Register(
  payload
) {
  const res = await FetchData.post(
    '/api/Account/register',
    {
      email: payload.Email,
      password: payload._password,
      fullname: payload._name,
      gender: payload.Gender,
      dateOfBirth: payload.DateOfBirth,
      address: payload.Address,
      token: payload.otp,
    },
    { credentials: 'include' }
  );
  return await res.json();
}

async function sendOTP(email) {
  const res = await FetchData.post('/api/Account/getOTP', email, {
    credentials: 'include',
  });
}
export { sendOTP };

