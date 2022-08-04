import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/solid';

function TopNav() {
  const router = useRouter();
  const {
    projectId,
    serviceId,
    deploymentId
  } = router.query;
  return <div
    className="flex container lg:max-w-[1248px] mx-auto py-2 items-center">
    <Link href="/projects" passHref>
      <a>
        <img src="/logo-s.svg" className="w-16" alt="razzo"/>
      </a>
    </Link>
    {projectId && <>
      <ArrowRightIcon width={24} color="#D2C4C2" className="mx-4"/>
      <Link href="/projects/[projectId]" as={`/projects/${projectId}`} passHref>
        <a>{projectId}</a>
      </Link>
    </>}
    {serviceId && <>
      <ArrowRightIcon width={24} color="#D2C4C2" className="mx-4"/>
      <Link
        href="/projects/[projectId]/services/[serviceId]"
        as={`/projects/${projectId}/services/${serviceId}`}
        passHref>
        <a>{serviceId}</a>
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
        <a>{deploymentId}</a>
      </Link>
    </>}
  </div>;
}

export default TopNav;
