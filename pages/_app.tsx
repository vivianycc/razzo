import '@styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { GeistProvider } from '@geist-ui/core';
import type { AppProps } from 'next/app';
import client from '@/apollo-client';

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
    <GeistProvider>
      <Component {...pageProps} />
    </GeistProvider>
  </ApolloProvider>;
}

export default appWithTranslation(MyApp);
