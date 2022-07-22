import GithubButton from '@components/GithubButton';
import PageHead from '@components/PageHead';
import Link from 'next/link';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return <div>
    <PageHead />
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo" />
      <div className="flex p-8">
        <GithubButton />
      </div>
      <div className="flex flex-col">
        <p className="text-center my-6">Example Links on this site</p>
        <Link href="/projects" passHref>
          <a className="text-blue-600">
            Project List Page - /projects
          </a>
        </Link>
        <Link href="/projects/[projectId]" as={`/projects/${1234}`}>
          <a className="text-blue-600">
            Project Info Page - /projects/123
          </a>
        </Link>
        <Link
          href="/projects/[projectId]/services"
          as={`/projects/${1234}/services`}>
          <a className="text-blue-600">
            Service List Page - /projects/123/services
          </a>
        </Link>
        <Link
          href="/projects/[projectId]/services/[serviceId]"
          as={`/projects/${1234}/services/${5678}`}
        >
          <a className="text-blue-600">
            Service Info Page - /projects/123/services/5678
          </a>
        </Link>
        <Link
          passHref
          href={'/projects/[projectId]/services/[serviceId]'
          + '/deployments/[deploymentId]'}
          as={`/projects/${1234}/services/${5678}/deployments/${7777}`}
        >
          <a className="text-blue-600">
            Deployment Log Page - /projects/123/services/5678/deployments/7777
          </a>
        </Link>
      </div>
    </div>
  </div>;
};

export default Home;
