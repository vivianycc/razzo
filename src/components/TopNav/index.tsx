import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useProjectData } from '@stores/projects';
import { useServiceData } from '@stores/services';

function TopNav() {
  const router = useRouter();
  const {
    projectId,
    serviceId,
    deploymentId
  } = router.query;
  const { project } = useProjectData(projectId as string | undefined);
  const { service } = useServiceData(serviceId as string | undefined);
  return <div
    className="flex container lg:max-w-[1248px]
    mx-auto py-4 items-center px-12">
    <Link href="/projects" passHref>
      <a>
        <img src="/logo-s.svg" className="w-16" alt="razzo"/>
      </a>
    </Link>
    {projectId && <>
      <ArrowRightIcon width={24} color="#D2C4C2" className="mx-4"/>
      <Link href="/projects/[projectId]" as={`/projects/${projectId}`} passHref>
        <a className="text-stone-800">{project?.name}</a>
      </Link>
    </>}
    {serviceId && <>
      <ArrowRightIcon width={24} color="#D2C4C2" className="mx-4"/>
      <Link
        href="/projects/[projectId]/services/[serviceId]"
        as={`/projects/${projectId}/services/${serviceId}`}
        passHref>
        <a className="text-stone-800">{service?.name}</a>
      </Link>
    </>}
    {deploymentId && <>
      <ArrowRightIcon width={24} color="#D2C4C2" className="mx-4"/>
      <Link
        href={'/projects/[projectId]/services/[serviceId]' +
          '/deployments/[deploymentId]'}
        as={`/projects/${projectId}/services/${serviceId
        }/deployments/${deploymentId}`}
        passHref>
        <a className="text-stone-800">
          {deploymentId.slice(deploymentId.length - 6, deploymentId.length)}
        </a>
      </Link>
    </>}
  </div>;
}

export default TopNav;
