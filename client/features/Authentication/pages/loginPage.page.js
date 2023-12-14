import DefaultLayout from '../DefaultLayout';
import LoginPage from '../login';

export const LoginPageOverView = () => {
  return (
    <DefaultLayout type='Register' path='/Register'>
      <LoginPage />
    </DefaultLayout>
  );
};
