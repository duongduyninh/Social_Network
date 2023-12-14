import { useQuery } from '@tanstack/react-query';

function useAuthentication(authProps) {
  const { data, isLoading, ...props } = useQuery({
    queryKey: ['authentication'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('accessToken') || '';
      const res = await fetch('https://localhost:7194/api/User/getProfileFromToken-user', {
        credentials: 'include',
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();
      return user;
    },
    staleTime: 60000 * 30,
    ...authProps,
  });

  return { data, isLoading, ...props };
}

export default useAuthentication;
