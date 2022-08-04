import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TopNav from '@components/TopNav';
import { useServicesData } from '@stores/services';

function ProjectInfoPage() {

  const projectId = useRouter().query.projectId as string | undefined;

  const { services } = useServicesData(projectId);

  return <div>
    <PageHead title={projectId + ' | Razzo'}/>
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">

      <Link
        href="/projects/[projectId]/deploy"
        as={`/projects/${projectId}/deploy`}
      >
        <a className="text-blue-500 my-8">Deploy New Service</a>
      </Link>

      <div>
        <p>Services of this Project</p>
        <div>
          {services.map(s => {
            return <div key={s._id}>
              <Link
                href="/projects/[projectId]/services/[serviceId]"
                as={`/projects/${projectId}/services/${s._id}`}
              >
                <div>
                  <p className="text-blue-500 mt-8">{s.name}</p>
                  <p>{s.gitProvider}/{s.repoOwner}/{s.repoName}</p>
                </div>
              </Link>
            </div>;
          })}
        </div>
      </div>
    </div>
  </div>;
}

export default ProjectInfoPage;
