import PageHead from '@components/PageHead';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import TopNav from '@components/TopNav';

const QUERY_GIT_NAMESPACE = gql`
    query {
        gitNamespaces {
            id
            installationID
            provider
            name
            type
        }
    }
`;

const QUERY_GIT_REPOS = gql`
    query ($namespaceID: Int!) {
        gitRepositories(gitNamespaceID: $namespaceID, provider: GITHUB) {
            id
            name
            url
            provider
        }
    }
`;

const CREATE_SERVICE = gql`
    mutation (
        $name: String!,
        $template: ServiceTemplate!,
        $projectID: ObjectID!,
        $gitProvider: GitProvider!,
        $repoOwner: String!,
        $repoName: String!,
        $branchName: String!
    ) {
        createService(
            name: $name,
            template: $template,
            projectID: $projectID,
            gitProvider: $gitProvider,
            repoOwner: $repoOwner,
            repoName: $repoName,
            branchName: $branchName
        ) {
            _id
        }
    }
`;

function DeployNewServicePage() {

  const projectId = useRouter().query.projectId;
  const router = useRouter();

  const [namespaceID, setNamespaceID] = useState();

  const {
    data: gitNamespaces,
    loading: isLoadingGitNamespaces
  } = useQuery(QUERY_GIT_NAMESPACE,
    { fetchPolicy: 'network-only' });

  const {
    data: gitRepositories,
    loading: isLoadingGitRepos
  } = useQuery(QUERY_GIT_REPOS, {
    fetchPolicy: 'network-only',
    variables: { namespaceID },
    skip: !namespaceID
  });

  const [createService] = useMutation(CREATE_SERVICE);

  return <div>
    <PageHead title={projectId + ' | Razzo'}/>
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <div className="w-96">

        <div className="mt-8">
          <p className="font-extrabold">Git Accounts</p>
          {isLoadingGitNamespaces ? <p>Loading...</p>
            : gitNamespaces?.gitNamespaces.map(
              (ns: any) => <div
                key={ns.id}
                className="cursor-pointer"
                onClick={() => setNamespaceID(ns.id)}>
                {ns.name}
              </div>)}
        </div>

        <div className="my-8">
          <p className="font-extrabold">Git Repositories</p>
          <div className="overflow-y-scroll h-64">
            {isLoadingGitRepos ? <p>Loading...</p>
              : gitRepositories?.gitRepositories.map((repo: any) =>
                <p
                  key={repo.id}
                  className="cursor-pointer"
                  onClick={async () => {
                    const res = await createService({
                      variables: {
                        name: repo.url.split('/')[5],
                        template: 'GIT',
                        projectID: projectId,
                        gitProvider: 'GITHUB',
                        repoOwner: repo.url.split('/')[4],
                        repoName: repo.url.split('/')[5],
                        branchName: 'main'
                      }
                    });
                    const serviceId = res.data.createService._id;
                    await router.push(
                      `/projects/${projectId}/services/${serviceId}`);
                  }}>
                  {repo.name}
                </p>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default DeployNewServicePage;
