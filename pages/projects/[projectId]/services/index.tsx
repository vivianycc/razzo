import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';

function ServicesPage() {

  const projectId = useRouter().query.projectId;

  return <div>
    <PageHead title={'Services - ' + projectId + ' | Razzo'} />
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo" />

      <div className="mt-8">
        <p>Services List Page</p>
        <p>project: {projectId}</p>
      </div>

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default ServicesPage;
