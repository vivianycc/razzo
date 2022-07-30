import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

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

function ServiceInfoPage() {

  const projectId = useRouter().query.projectId;
  const serviceId = useRouter().query.serviceId;

  const { data } = useQuery(QUERY_DEPLOYMENTS, {
    fetchPolicy: 'network-only',
    variables: { serviceID: serviceId }
  });

  const deployments = data?.deployments?.edges.map((e: any) => e.node);

  return <div>
    <PageHead title={serviceId + ' | Razzo'}/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo"/>

      <div className="mt-8">
        <p>Service Info Page</p>
        <p>project: {projectId}</p>
        <p>service: {serviceId}</p>
      </div>

      <div>
        <p>Deployments</p>
        <div>
          {deployments?.map((deployment: any) => {
            return <div key={deployment._id}>
              <Link
                href={'/projects/[projectId]/services/[serviceId]' +
                  '/deployments/[deploymentId]'}
                as={`/projects/${projectId}/services/${serviceId
                }/deployments/${deployment._id}`}
              >
                <div>
                  <p className="text-blue-500 mt-8">{deployment._id}</p>
                  <p>Created at {deployment.createdAt}</p>
                  <p>{deployment.commitMessage}</p>
                  <p>{deployment.status}</p>
                </div>
              </Link>
            </div>;
          })}
        </div>
      </div>

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default ServiceInfoPage;
