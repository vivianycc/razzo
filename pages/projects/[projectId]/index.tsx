import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import TopNav from '@components/TopNav';

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
    </div>
  </div>;
}

export default ProjectInfoPage;
