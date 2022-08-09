import PageHead from '@components/PageHead';
import Link from 'next/link';
import TopNav from '@components/TopNav';
import { useProjectsData } from '@stores/projects';
import { Button } from '@geist-ui/core';

function ProjectsPage() {
  const { projects } = useProjectsData();
  return <div>
    <PageHead title="Projects | Razzo"/>
    <TopNav/>
    <div className="container px-12 lg:max-w-[1248px] mx-auto py-2 mb-16">
      <div className="w-full flex justify-between items-center">
        <p className="text-5xl mt-8 mb-12">Project List</p>
        <Link href="/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {Array.from(projects.values()).map(project => <Link
          href="/projects/[projectId]"
          key={project._id}
          as={`/projects/${project._id}`}
        >
          <div className="bg-white p-4 rounded-xl cursor-pointer">
            <img
              className="w-full h-48 object-cover rounded-xl"
              alt=""
              src="https://razzo.app/og.png"
            />
            <p className="text-xl text-stone-800 mt-4">{project.name}</p>
            <p className="text-sm text-stone-800 mt-2">2 services</p>
          </div>
        </Link>
        )}
      </div>
    </div>
  </div>;
}

export default ProjectsPage;
