import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { router } from 'next/client';
import TopNav from '@components/TopNav';

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

const DELETE_SERVICE = gql`
    mutation ($serviceID: ObjectID!) {
        deleteService(_id: $serviceID)
    }
`;

function ServiceInfoPage() {

  const projectId = useRouter().query.projectId;
  const serviceId = useRouter().query.serviceId;

  const { data } = useQuery(QUERY_DEPLOYMENTS, {
    fetchPolicy: 'network-only',
    variables: { serviceID: serviceId }
  });

  const [deleteService] = useMutation(DELETE_SERVICE);

  const deployments = data?.deployments?.edges.map((e: any) => e.node);

  return <div>
    <PageHead title={serviceId + ' | Razzo'}/>
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">

      <div className="mt-8">
        <p>Service Info Page</p>
        <p>project: {projectId}</p>
        <p>service: {serviceId}</p>
      </div>

      <div className="my-8">
        <p
          className="text-red-500 cursor-pointer"
          onClick={async () => {
            await deleteService({ variables: { serviceID: serviceId } });
            await router.push('/projects/[projectId]',
              `/projects/${projectId}`);
          }}>
          Delete Service
        </p>
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
    </div>
  </div>;
}

export default ServiceInfoPage;
