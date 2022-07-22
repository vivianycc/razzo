import BuildLogs from '@components/BuildLogs';
import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';

function DeploymentInfoPage() {

  const projectId = useRouter().query.projectId;
  const serviceId = useRouter().query.serviceId;
  const deploymentId = useRouter().query.deploymentId;

  return <div>
    <PageHead title={serviceId + ' | Razzo'} />
    <div
      className="w-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo" />

      <div className="mt-8">
        <p>Deployment Info Page</p>
        <p>project: {projectId}</p>
        <p>service: {serviceId}</p>
        <p>deployment: {deploymentId}</p>
      </div>

      <div className="mt-12">
        <p className="mb-4">Example Build Log</p>
        <BuildLogs />
      </div>

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default DeploymentInfoPage;
