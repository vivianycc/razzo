import '@styles/globals.css';
import { ApolloProvider, gql, useSubscription } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { GeistProvider, Themes, useToasts } from '@geist-ui/core';
import { useRouter } from 'next/router';
import useRevalidate from '@hooks/useRevalidate';
import type { AppProps } from 'next/app';
import client from '@/apollo-client';

const theme = Themes.createFromLight({
  type: 'primary',
  palette: { background: '#fbfbfb' },
  expressiveness: { shadowSmall: '0px 0px 1px rgb(0 0 0/0.1),0px 10px 24px rgb(0 0 0/0.08)', },
  layout: { radius: '8px' },
});

function MyApp({
  Component,
  pageProps
}: AppProps) {
  useEffect(() => {
    const tokenInCookie = document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('token='));
    const tokenInLocalStorage = localStorage.getItem('token');
    if (tokenInCookie && !tokenInLocalStorage) {
      localStorage.setItem('token', tokenInCookie.split('=')[1]);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <GeistProvider themes={[theme]} themeType="primary">
        <ProjectActivityListener/>
        <Component {...pageProps} />
      </GeistProvider>
    </ApolloProvider>
  );
}

function ProjectActivityListener() {
  const projectId = useRouter().query.projectId as string | undefined;
  const revalidate = useRevalidate();

  const toast = useToasts();

  useSubscription(
    gql`
        subscription ($projectId: ObjectID!) {
            projectActivityReceived(projectId: $projectId) {
                type
                payload
            }
        }
    `,
    {
      variables: { projectId },
      skip: !projectId,
      onSubscriptionData: async ({ subscriptionData }: any) => {
        const data = subscriptionData.data.projectActivityReceived;
        const payload = data.payload ? JSON.parse(data.payload) : undefined;
        switch (data.type) {
          case 'BUILD_START':
            await revalidate.revalidateDeployments(payload.serviceID);
            toast.setToast({
              text: 'Build ' + payload?.buildID + ' started',
              type: 'secondary',
            });
            break;
          case 'BUILD_SUCCESS':
            await revalidate.revalidateDeployments(payload.serviceID);
            toast.setToast({
              text: 'Build ' + payload?.buildID + ' build successes',
              type: 'success',
            });
            break;
          case 'BUILD_FAILED':
            await revalidate.revalidateDeployments(payload.serviceID);
            toast.setToast({
              text: 'Build ' + payload?.buildID + ' failed',
              type: 'error',
            });
            break;
        }
      },
    }
  );

  return null;
}

export default appWithTranslation(MyApp);
