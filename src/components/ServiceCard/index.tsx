import { Card } from '@geist-ui/core';
import Service from '@models/service';
import { useDeploymentsData } from '@stores/deployment';
import { DeploymentStatus } from '@models/deployment';
import { useRouter } from 'next/router';

interface Props {
  service: Service;
}

export default function ServiceCard(props: Props) {

  const router = useRouter();
  const projectId = useRouter().query.projectId as string | undefined;
  const { deployments } = useDeploymentsData(props.service._id);

  return (
    <Card
      onClick={async () => {
        await router.push(
          '/projects/[projectId]/services/[serviceId]',
          `/projects/${projectId}/services/${props.service._id}`
        );
      }}
      shadow
      hoverable
      className="cursor-pointer"
      style={{
        borderRadius: '16px',
        backgroundColor: '#FFF'
      }}
    >
      <Card.Content className="flex">
        <div className="bg-primary-100 w-16 h-16 rounded-lg">
          <img src="/logo-s-mono.svg" alt=""/>
        </div>
        <div className="ml-3">
          <span
            className="flex items-center gap-2 capitalize before:content-['']
            before:block before:w-3 before:h-3
            before:bg-green-300 before:rounded-full">
            {/* props.service.status */ 'Running'}
          </span>
          <p className="mt-2 mb-1 text-lg font-bold capitalize">
            {props.service.name}
          </p>
          <p className="my-1 text-sm">
            Deployed at
            {/* props.service.lastDeployedAt */ '07/25 16:00'}
          </p>
          <p className="my-1 text-sm text-gray-400">
            from {props.service.gitProvider}
          </p>

          {(deployments.length > 0 &&
              deployments[0].status === DeploymentStatus.BUILDING) &&
              <p
                className="my-1 py-1 px-2 rounded border border-orange-200
              bg-orange-200/20 text-sm text-orange-400">
                New Deploy Ongoing
              </p>}

        </div>
      </Card.Content>
    </Card>
  );
}
