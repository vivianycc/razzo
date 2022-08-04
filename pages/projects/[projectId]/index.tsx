import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';

const QUERY_SERVICES = gql`
    query ($projectId: ObjectID!) {
        services(projectID: $projectId) {
            edges {
                node {
                    _id
                    name
                    gitProvider
                    repoOwner
                    repoName
                }
            }
        }
    }
`;

function ProjectInfoPage() {

  const projectId = useRouter().query.projectId;

  const { data } = useQuery(QUERY_SERVICES, {
    fetchPolicy: 'network-only',
    variables: { projectId }
  });

  return <div>
    <PageHead title={projectId + ' | Razzo'}/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo"/>

      <div className="mt-8">
        <p>Project Info Page</p>
        <p>project: {projectId}</p>
      </div>

      <Link
        href="/projects/[projectId]/deploy"
        as={`/projects/${projectId}/deploy`}
      >
        <a className="text-blue-500 my-8">Deploy New Service</a>
      </Link>

      <div>
        <p>Services of this Project</p>
        <div>
          {data && data.services.edges.map(({ node }: any) => {
            return <div key={node._id}>
              <Link
                href="/projects/[projectId]/services/[serviceId]"
                as={`/projects/${projectId}/services/${node._id}`}
              >
                <div>
                  <p className="text-blue-500 mt-8">{node.name}</p>
                  <p>{node.gitProvider}/{node.repoOwner}/{node.repoName}</p>
                </div>
              </Link>
            </div>;
          })}
        </div>
      </div>

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default ProjectInfoPage;
