import LoadingPage from '@features/LoadingPage';
import useAuthentication from '@Hooks/useAuthentication';
import { useRouter } from 'next/router';

function LoggedPages({ children }) {
  const { isLoading, isError, data } = useAuthentication();
  const router = useRouter();

  if (data && !data?.userId) {
    router.push('/Login');
    return <></>;
  }

  return children;
}

export default LoggedPages;
