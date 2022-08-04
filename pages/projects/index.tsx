import PageHead from '@components/PageHead';
import Link from 'next/link';
import TopNav from '@components/TopNav';
import { useProjectsData } from '@stores/projects';

function ProjectsPage() {
  const { projects } = useProjectsData();
  return <div>
    <PageHead title="Projects | Razzo"/>
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">

      <div className="mt-8">
        <p>Project List Page</p>
      </div>

      {Array.from(projects.values()).map(project => {
        return <div key={project._id}>
          <Link
            href="/projects/[projectId]"
            as={`/projects/${project._id}`}
          >
            <a className="text-blue-500 mt-8">{project.name}</a>
          </Link>
        </div>;
      })}
    </div>
  </div>;
}

export default ProjectsPage;
