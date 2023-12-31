import LoadingPage from '@features/LoadingPage';
import useAuthentication from '@Hooks/useAuthentication';
import { useRouter } from 'next/router';

function NoneLoggedPages({ children }) {
  const { isLoading, isError, data } = useAuthentication();
  const router = useRouter();

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  if (data && data?.userId) {
    router.push('/');
    return <></>;
  }

  return children;
}

export default NoneLoggedPages;
