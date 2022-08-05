import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import TopNav from '@components/TopNav';
import { useServiceData } from '@stores/services';
import { useProjectData } from '@stores/projects';
import { useDeploymentsData } from '@stores/deployment';

const DELETE_SERVICE = gql`
    mutation ($serviceID: ObjectID!) {
        deleteService(_id: $serviceID)
    }
`;

function ServiceInfoPage() {

  const router = useRouter();
  const {
    projectId,
    serviceId
  } = router.query;
  const { project } = useProjectData(projectId as string | undefined);
  const { service } = useServiceData(serviceId as string | undefined);
  const { deployments } = useDeploymentsData(serviceId as string | undefined);

  const [deleteService] = useMutation(DELETE_SERVICE);

  return <div>
    <PageHead
      title={(service?.name || serviceId) + ' | ' +
        (project?.name || projectId) + ' | Razzo'}
    />
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
