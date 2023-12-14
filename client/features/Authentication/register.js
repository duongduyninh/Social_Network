import { SearchInput } from '@Components/Input/SearchInput';
import { toastConfig } from '@utils/toastConfig';
import { Register, sendOTP } from 'Apis/authentication.api';

import Router from 'next/router';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
// import { CheckUserExists } from '../../Apis/user.api';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import Button from '../../Components/Button';
import useFormValidation from '../../Hooks/useFormValidation';
import styles from './authentication.module.scss';

const inputArray = [
  {
    type: 'text',
    placeholder: 'Enter email or user name',
    key: 'Email',
  },
  {
    type: 'text',
    placeholder: 'Create User Name',
    key: '_name',
  },
  {
    type: 'text',
    placeholder: 'Address',
    key: 'Address',
  },
  {
    type: 'password',
    placeholder: 'Password',
    key: '_password',
  },
];

function RegisterPage() {
  const { data, handleChange, handleSubmit, handleBlur, errors, setErrors } = useFormValidation({
    validations: {
      Email: {
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "That email address doesn't look right!",
        },
        required: {
          value: true,
          message: 'Choose a Gmail address',
        },
      },
      _name: {
        required: {
          value: true,
          message: 'Enter a user name',
        },
      },
      Address: {
        required: {
          value: true,
          message: 'Enter a address',
        },
      },
      _password: {
        required: {
          value: true,
          message: 'Enter a password',
        },
        custom: {
          isValid(value) {
            return value.length >= 6;
          },
          message: 'Password has at least 6 digits',
        },
      },
      otp: {
        required: {
          value: true,
          message: 'Enter a OTP',
        },
        custom: {
          isValid(value) {
            return value.length === 6;
          },
          message: 'OTP only has 6 digits',
        },
      },
    },
    initial: {
      _name: '',
      _password: '',
      Email: '',
      Address: '',
      otp: '',
      DateOfBirth: '',
      Gender: '0',
    },
  });
  const [isFetching, setIsFetching] = useState(false);
  const [countDown, setCountDown] = useState(120);

  const handleUserExists = (params = '') => {};
  let stateSendMail = false;
  for (const key in errors) {
    if (!data[key] && key !== 'otp') {
      break;
    }
  }
  for (const key in data) {
    if (!data[key] && key !== 'otp') {
      stateSendMail = true;
      break;
    }
    stateSendMail = false;
  }

  const handleSendMail = () => {
    if (!stateSendMail) {
      sendOTP(data.Email);
      setCountDown((prev) => prev - 1);
      let timeOut = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            clearInterval(timeOut);
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  const handleRegister = () => {
    Register(data)
      .then((res) => {
        switch (res.status) {
          case 400:
            toast.warning('Please enter your information', toastConfig);
            break;
          case 408:
            toast.error(res.message, toastConfig);
            break;
          case 200:
            Router.push(
              {
                pathname: '/Login',
                query: {
                  isRegister: true,
                },
              },
              '/Login'
            );
            break;
          default:
            toast.error('Internal Server Error. Try later!', toastConfig);
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error('Internal Server Error. Try later!', toastConfig);
      });
  };
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
          handleSubmit(handleRegister);
        }}
      >
        <div className="mb-11">
          <div className={styles['title']}>Sign Up</div>
          <div className={styles['wrapper']}>
            {inputArray.map((value) => (
              <div className={styles['item']} key={value.key}>
                <SearchInput
                  {...value}
                  onChange={({ target }) => {
                    handleChange(
                      value.key,
                      value.key === 'Email' ? handleUserExists : undefined
                    )(target.value);
                  }}
                  onBlur={handleBlur(value.key)}
                  className={styles['inp']}
                />
                {errors[value.key] && <p className={styles['error']}>{errors[value.key]}</p>}
              </div>
            ))}
            <div
              className={styles['item']}
              style={{
                flexDirection: 'row',
              }}
            >
              <select
                className={styles['namnu']}
                onChange={({ target: { value } }) => {
                  handleChange('Gender')(value);
                }}
              >
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
              </select>
              <input
                type="date"
                className={styles['ngaythangnam']}
                onChange={({ target: { value } }) => {
                  handleChange('DateOfBirth')(value);
                }}
              />
            </div>
            <div className="relative mt-[20px]">
              <SearchInput
                onChange={({ target: { value } }) => {
                  handleChange('otp')(value);
                }}
                onBlur={handleBlur('otp')}
                className={styles['inp']}
                placeholder="OTP"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSendMail();
                }}
                disabled={data.Email ? false : true}
                className="absolute p-3  right-0 top-0 h-full rounded-r-md  w-[150px]"
              >
                {countDown === 120 ? 'Send Mail' : countDown}
              </Button>
              {errors['otp'] && <p className="absolute -bottom-7 text-sm text-red-500">{errors['otp']}</p>}
            </div>
          </div>
        </div>
        <Button disabled={Object.keys(errors).length > 0} className="w-full p-3 rounded-lg">
          Register
        </Button>
      </form>
      <ToastContainer pauseOnFocusLoss={false} />
    </>
  );
}

export default RegisterPage;
