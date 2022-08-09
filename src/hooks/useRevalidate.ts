import { gql, useApolloClient } from '@apollo/client';
import Deployment from '@models/deployment';
import { updateDeploymentData } from '@stores/deployment';

const QUERY_DEPLOYMENTS = gql`
    query ($serviceID: ObjectID!) {
        deployments(serviceID: $serviceID) {
            edges {
                node {
                    _id
                    status
                    commitMessage
                    commitSHA
                    createdAt
                }
            }
        }
    }
`;

function useRevalidate() {

  const apollo = useApolloClient();

  async function revalidateDeployments(serviceID: string): Promise<Deployment> {
    const res = await apollo.query({
      query: QUERY_DEPLOYMENTS,
      variables: { serviceID }
    });
    const deps = res.data.deployments.edges.map(({ node }: any) => node);
    updateDeploymentData(deps);
    return deps;
  }

  return { revalidateDeployments };
}

export default useRevalidate;
