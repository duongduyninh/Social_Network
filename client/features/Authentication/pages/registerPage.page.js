import DefaultLayout from '../DefaultLayout';
import RegisterPage from '../register';

export const RegisterPageOverView = () => {
  return (
    <DefaultLayout type='Login' path='/Login'>
      <RegisterPage />
    </DefaultLayout>
  );
};
