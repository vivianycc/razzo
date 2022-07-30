import PageHead from '@components/PageHead';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

const QUERY_PROJECTS = gql`
    query {
        projects {
            edges {
                node {
                    _id
                    name
                    owner {
                        _id
                        email
                        name
                    }
                }
            }
        }
    }
`;

function ProjectsPage() {

  const { data } = useQuery(QUERY_PROJECTS,
    { fetchPolicy: 'cache-and-network' });

  return <div>
    <PageHead title="Projects | Razzo"/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo"/>

      <div className="mt-8">
        <p>Project List Page</p>
      </div>

      {data && data.projects && data.projects.edges.map(({ node }: any) => {
        return <div key={node._id}>
          <Link
            href="/projects/[projectId]"
            as={`/projects/${node._id}`}
          >
            <a className="text-blue-500 mt-8">{node.name}</a>
          </Link>
        </div>;
      })}

      <Link href="/" passHref>
        <a className="text-blue-500 mt-8">Back Home</a>
      </Link>

    </div>
  </div>;
}

export default ProjectsPage;
