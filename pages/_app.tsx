import '@styles/globals.css';
import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import client from '@/apollo-client';

function MyApp({ Component, pageProps }: AppProps) {
  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>;
}

export default appWithTranslation(MyApp);
