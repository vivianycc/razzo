import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// const API_URL = 'api.razzo.app/graphql';
const API_URL = 'localhost:8080/graphql';

function getToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MmM2OWJmMjAzYTZkYWE0ZTM0MTkyYjYiLCJqdGkiOiI2MmM2OWJmMjAzYTZkYWE0ZTM0MTkyYjYxNjU4NDIyMDcyIiwiaWF0IjoxNjU4NDIyMDcyLCJpc3MiOiJteWJvb20ifQ.8bbM3is1FcH7tKqP6XtN30hsbdw4Soox-V8Uy4dmS-k';
  if(isBrowser()) {
    return localStorage.getItem('token') || 'undefined';
  }
  return 'undefined';
}

function getWSLink() {
  return new GraphQLWsLink(createClient({
    url: 'ws://' + API_URL,
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
  uri: 'http://' + API_URL,
  cache: new InMemoryCache(),
  link: isBrowser() ? ApolloLink.from([authLink, getWSLink()]) : undefined,
});

export default client;

