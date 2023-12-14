import { MessagesBoxProvider } from '@Context/MessagesBox.Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CookiesProvider } from 'react-cookie';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import { DetectProvider } from '../Context/DetectElement.Context';
import ThemeProvider from '../Context/Theme.Context';
import '../styles/globals.css';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 60000 * 5,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DetectProvider>
          <CookiesProvider>
            <MessagesBoxProvider>
              <Component {...pageProps} />
            </MessagesBoxProvider>
          </CookiesProvider>
        </DetectProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
