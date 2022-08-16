import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TopNav from '@components/TopNav';
import ServiceCard from '@components/ServiceCard';
import { useServicesData } from '@stores/services';
import { useProjectData } from '@stores/projects';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@geist-ui/core';

const DELETE_PROJECT = gql`
    mutation ($projectId: ObjectID!) {
        deleteProject(_id: $projectId)
    }
`;

function ProjectInfoPage() {
  const projectId = useRouter().query.projectId as string | undefined;

  const router = useRouter();
  const { project } = useProjectData(projectId);
  const { services } = useServicesData(projectId);

  const [deleteProject] = useMutation(DELETE_PROJECT);

  return (
    <div>
      <PageHead title={(project?.name || projectId) + ' | Razzo'}/>
      <TopNav/>
      <div className=" h-screen container lg:max-w-[1248px] mx-auto  px-12">
        <header className="flex justify-between items-center">
          <p className="text-5xl mb-8 mt-12">
            {project?.name || projectId}
          </p>

          <div>
            <Button>Project Settings</Button>

            <Link
              href="/projects/[projectId]/deploy"
              as={`/projects/${projectId}/deploy`}
            >
              <a className="text-blue-500 my-8 ml-4">
                <Button type="secondary">Deploy New Service </Button>
              </a>
            </Link>
          </div>
        </header>

        <div id="overview" className="flex gap-3">
          <div
            className="box-border bg-white rounded-3xl
            w-1/2 p-6 drop-shadow-xl">
            <h5 className="text-base mb-4">Service Status</h5>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400 font-bold">Total</p>
                <p className="text-2xl my-0 font-bold">7</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400 font-bold">Running</p>
                <p className="text-2xl my-0 font-bold">6</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400 font-bold">Crashed</p>
                <p className="text-2xl my-0 font-bold">1</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-gray-400 font-bold">Deploying</p>
                <p className="text-2xl my-0 font-bold">2</p>
              </div>
            </div>
          </div>

          <div
            className="box-border bg-primary-100 rounded-3xl
            w-1/2 p-6 flex justify-between drop-shadow-xl">
            <div className="flex flex-col items-center justify-between">
              <p className="text-sm text-gray-900 mt-0 font-bold">
                <span>Total Cpu Usage</span>
                <br/>
                <span className="text-xs text-gray-400">minutely vCPU</span>
              </p>
              <p className="text-2xl my-0 font-bold">7</p>
            </div>
            <div className="flex flex-col items-center justify-between">
              <p className="text-sm text-gray-900 mt-0 font-bold">
                <span>Memory Usage</span>
                <br/>
                <span className="text-xs text-gray-400 ">minutely GB</span>
              </p>

              <p className="text-2xl my-0 font-bold">6</p>
            </div>
            <div className="flex flex-col items-center justify-between">
              <p className="text-sm text-gray-900 mt-0 font-bold">
                Monthly Charges
              </p>
              <p className="text-2xl my-0 font-bold">1</p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-8 mt-16">Services of this Project</p>
          <div className="grid grid-cols-3 gap-2">
            {services.map((s) => <div key={s._id}>
              <Link
                href="/projects/[projectId]/services/[serviceId]"
                as={`/projects/${projectId}/services/${s._id}`}
              >
                <ServiceCard service={s}/>
              </Link>
            </div>)}
          </div>
        </div>
        <div className="my-8">
          <p
            className="text-red-500 cursor-pointer"
            onClick={async () => {
              await deleteProject({ variables: { projectId } });
              await router.push(
                '/projects/[projectId]',
                `/projects/${projectId}`
              );
            }}
          >
            Delete Project
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectInfoPage;
