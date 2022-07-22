import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const API_URL = 'api.razzo.app/graphql';

function getToken() {
  if(isBrowser()) {
    return localStorage.getItem('token') || 'undefined';
  }
  return 'undefined';
}

function getWSLink() {
  return new GraphQLWsLink(createClient({
    url: 'wss://' + API_URL,
    connectionParams: { authToken: getToken() },
  }));
}

function isBrowser() {
  return typeof window !== 'undefined';
}

const authLink = setContext((_, { headers }) => {
  return {
	  headers: {
      	...headers,
      	authorization: `Bearer ${getToken()}`
	  }
  };
});

const client = new ApolloClient({
  uri: 'https://' + API_URL,
  cache: new InMemoryCache(),
  link: isBrowser() ? ApolloLink.from([authLink, getWSLink()]) : undefined,
});

export default client;

