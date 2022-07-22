import PageHead from '@components/PageHead';
import Link from 'next/link';

function ProjectsPage() {
  return <div>
    <PageHead title="Projects | Razzo" />
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo" />

      <div className="mt-8">
        <p>Project List Page</p>
      </div>

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default ProjectsPage;
