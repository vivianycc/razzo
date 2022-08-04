import PageHead from '@components/PageHead';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import TopNav from '@components/TopNav';

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
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">

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
    </div>
  </div>;
}

export default ProjectsPage;
