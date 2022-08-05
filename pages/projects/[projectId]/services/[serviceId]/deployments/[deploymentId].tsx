import BuildLogs from '@components/BuildLogs';
import PageHead from '@components/PageHead';
import { useRouter } from 'next/router';
import TopNav from '@components/TopNav';
import { useDeploymentsData } from '@stores/deployment';
import StatusBadge from '@components/StatusBadge';

function DeploymentInfoPage() {

  const projectId = useRouter().query.projectId;
  const serviceId = useRouter().query.serviceId;
  const deploymentId = useRouter().query.deploymentId as string;
  const { deployments } = useDeploymentsData(serviceId as string | undefined);
  const deployment = deployments?.find(
    (deployment: any) => deployment._id === deploymentId);

  return <div>
    <PageHead title={serviceId + ' | Razzo'}/>
    <TopNav/>
    <div className="container lg:max-w-[1248px] mx-auto py-2 items-center">

      <div className="my-12 bg-white p-8 rounded-2xl flex">
        <div className="mr-12">
          <p className="font-bold">Status</p>
          {deployment?.status &&
            <StatusBadge status={deployment.status}/>}
        </div>
        <div className="mr-12">
          <p className="font-bold">Duration</p>
          <p className="mt-3 text-stone-400">
            1m 24s (7days ago)
          </p>
        </div>
        <div className="mr-12">
          <p className="font-bold">Branch</p>
          <p className="mt-3">main</p>
        </div>
        <div className="flex-grow">
          <p className="font-bold">Deploy Message</p>
          <p className="mt-3 text-stone-400"></p>
        </div>
      </div>

      <div className="my-12 bg-white p-8 rounded-2xl">
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
