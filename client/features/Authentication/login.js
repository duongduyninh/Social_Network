import { SearchInput } from '@Components/Input/SearchInput';
import { toastConfig } from '@utils/toastConfig';
import { Login } from 'Apis/authentication.api';
import clsx from 'clsx';
import Link from 'next/link';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../Components/Button';
import styles from './authentication.module.scss';
import useFormValidation from '@Hooks/useFormValidation';

function LoginPage() {
  const { data, handleChange, handleSubmit, handleBlur, errors } = useFormValidation({
    validations: {
      _account: {
        required: {
          value: true,
          message: 'This field is required',
        },
      },
      _password: {
        required: {
          value: true,
          message: 'This field is required',
        },
      },
    },
    initial: {
      _account: '',
      _password: '',
    },
  });
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsFetching(true);
    Login({
      email: data._account,
      password: data._password,
    })
      .then((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        queryClient.setQueryData(['authentication'], res.user);
        setIsFetching(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (router.query.isRegister) {
    // console.log('?');
    toast.success('Registered successfully', toastConfig);
    router.query.isRegister = '';
  }
  return (
    <>
      {isFetching && (
        <div className={styles['loading_wrapper']}>
          <IconSoftLoading className={styles['loading_icon']} />
          <p className={styles['loading_content']}>Loading...</p>
        </div>
      )}
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleLogin);
        }}
      >
        <div className="mb-11">
          <div className={styles['title']}>Login</div>
          <div className={styles['wrapper']}>
            <div className={styles['item']}>
              <SearchInput
                className={clsx(styles['inp'])}
                placeholder="Enter email or user name"
                type="text"
                onChange={({ target: { value } }) => {
                  handleChange('_account')(value);
                }}
                onBlur={handleBlur('_account')}
              />
              {errors._account && <p className={styles['error']}>{errors._account}</p>}
            </div>
            <section className={styles['item']}>
              <SearchInput
                type="password"
                placeholder="password"
                onChange={({ target: { value } }) => {
                  handleChange('_password')(value);
                }}
                onBlur={handleBlur('_password')}
                className={styles['inp']}
              />
              {errors._password && <p className={styles['error']}>{errors._password}</p>}
            </section>
          </div>
          <div className={styles['forgot']}>
            <Link href={"/Register"}>
                <a  className="text-[#0084ff] font-semibold">Register here</a>
            </Link></div>
        </div>
        <Button disabled={Object.keys(errors).length > 0} className="w-full p-3 rounded-lg">
          Login
        </Button>
        <div className="mt-14 mb-11 text-center text-gray-400">or continue with</div>
        <div className="flex justify-center align-middle gap-4 ">
          <BsFacebook className="text-blue-500 text-3xl" />
          <FcGoogle className="text-3xl" />
        </div>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </>
  );
}

export default LoginPage;
