import '@styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import client from '@/apollo-client';

const theme = extendTheme({
  colors: {
    primary: {
      50: '#F4F0F0',
      100: '#E3DAD9',
      200: '#D2C4C2',
      300: '#C1AEAB',
      400: '#B09994',
      500: '#9F837E',
      600: '#8E6D67',
      700: '#775C55',
      800: '#604B43',
      900: '#493932',
    },
  },
  styles: { global: { body: { bg: '#F8F8F8' } } }
});

function MyApp({
  Component,
  pageProps
}: AppProps) {

  useEffect(() => {
    const tokenInCookie = document.cookie.split(';')
      .find(c => c.trim().startsWith('token='));
    const tokenInLocalStorage = localStorage.getItem('token');
    if (tokenInCookie && !tokenInLocalStorage) {
      localStorage.setItem('token', tokenInCookie.split('=')[1]);
    }
  }, []);

  return <ApolloProvider client={client}>
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  </ApolloProvider>;
}

export default appWithTranslation(MyApp);
