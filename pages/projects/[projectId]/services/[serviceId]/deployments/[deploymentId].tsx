import BuildLogs from '@components/BuildLogs';
import PageHead from '@components/PageHead';
import { useRouter } from 'next/router';
import TopNav from '@components/TopNav';

function DeploymentInfoPage() {

  const projectId = useRouter().query.projectId;
  const serviceId = useRouter().query.serviceId;
  const deploymentId = useRouter().query.deploymentId as string;

  return <div>
    <PageHead title={serviceId + ' | Razzo'}/>
    <TopNav/>
    <div
      className="w-screen flex justify-center
     items-center flex-col">

      <div className="mt-8">
        <p>Deployment Info Page</p>
        <p>project: {projectId}</p>
        <p>service: {serviceId}</p>
        <p>deployment: {deploymentId}</p>
      </div>

      <div className="mt-12">
        <p className="mb-4">Example Build Log</p>
        <BuildLogs deploymentId={deploymentId}/>
      </div>
    </div>
  </div>;
}

export default DeploymentInfoPage;
