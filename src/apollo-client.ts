import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const API_URL = 'api.razzo.app/graphql';

function getToken() {
  if (isBrowser()) {
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

const httpLink = new HttpLink({ uri: 'https://' + API_URL, });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${getToken()}`
    }
  }));
  return forward(operation);
});

const splitLink = () => {
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    getWSLink(),
    concat(authMiddleware, httpLink)
  );
};

const client = new ApolloClient({
  uri: 'https://' + API_URL,
  cache: new InMemoryCache(),
  link: isBrowser() ? splitLink() : undefined,
});

export default client;

