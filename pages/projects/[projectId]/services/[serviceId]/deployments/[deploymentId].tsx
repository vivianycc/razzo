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
    <div className="container lg:max-w-[1248px] mx-auto py-2 items-center">

      <div className="mt-8">
        <p>Deployment Info Page</p>
        <p>project: {projectId}</p>
        <p>service: {serviceId}</p>
        <p>deployment: {deploymentId}</p>
      </div>

      <div className="mt-12 bg-white p-8 rounded-2xl">
        <div className="mb-4 flex flex-row">
          <div className="mr-4 cursor-pointer">
            <p className="text-primary-900 text-lg">
              Build Log
            </p>
            <div className="border-b-2 border-primary-300"/>
          </div>
          <div className="cursor-pointer">
            <p className="text-stone-400 text-lg">
              Deploy Log
            </p>
          </div>
        </div>
        <BuildLogs deploymentId={deploymentId}/>
      </div>
    </div>
  </div>;
}

export default DeploymentInfoPage;
