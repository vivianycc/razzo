import PageHead from '@components/PageHead';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
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

const QUERY_REPO_BRANCHES = gql`
    query ($repoOwner: String!, $repoName: String!) {
        gitRepoBranches(
            repoName: $repoName,
            repoOwner: $repoOwner,
            provider: GITHUB
        )
    }
`;

function DeployNewServicePage() {

  const projectId = useRouter().query.projectId;
  const router = useRouter();

  const [namespaceID, setNamespaceID] = useState<string>();
  const [repo, setRepo] = useState<any>();
  const [branch, setBranch] = useState<string>();
  const [repoKeyword, setRepoKeyword] = useState<string>('');

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

  const {
    data: gitRepoBranches,
    loading: isLoadingGitRepoBranches
  } = useQuery(QUERY_REPO_BRANCHES, {
    fetchPolicy: 'network-only',
    variables: {
      repoOwner: repo?.url.split('/')[4],
      repoName: repo?.url.split('/')[5],
    },
    skip: !repo
  });

  const [createService] = useMutation(CREATE_SERVICE);

  async function submit() {
    if (!repo) return;
    try {
      const res = await createService({
        variables: {
          name: repo?.url.split('/')[5],
          template: 'GIT',
          projectID: projectId,
          gitProvider: 'GITHUB',
          repoOwner: repo.url.split('/')[4],
          repoName: repo.url.split('/')[5],
          branchName: branch
        }
      });
      const serviceId = res.data.createService._id;
      await router.push(
        `/projects/${projectId}/services/${serviceId}`);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!namespaceID) setNamespaceID(gitNamespaces?.gitNamespaces[0].id);
  }, [gitNamespaces?.gitNamespaces]);

  return <div>
    <PageHead title={projectId + ' | Razzo'}/>
    <TopNav/>
    <div className="container lg:max-w-[1248px] mx-auto py-2 mb-16">
      <p className="text-5xl mt-8 mb-12">Deploy New Service</p>
      <div className="flex gap-6">
        <div>
          <div className="bg-white p-8 rounded-2xl mb-6 w-64">
            Steps
          </div>
        </div>
        <div className="bg-white flex-grow p-8 rounded-2xl">
          <div>
            <p className="text-3xl text-primary-900">Import Git Repository</p>
            <div className="flex my-4">
              <select
                value={namespaceID}
                onChange={e => setNamespaceID(e.target.value)}
              >
                {gitNamespaces?.gitNamespaces.map((namespace: any) => <option
                  key={namespace.id}
                  value={namespace.id}
                >
                  {namespace.name}
                </option>)}
              </select>
              <input
                placeholder="Search Repositories"
                value={repoKeyword}
                onChange={e => setRepoKeyword(e.target.value)}
              />
            </div>
            <div className="overflow-y-scroll h-96 my-8">
              {isLoadingGitRepos ? <p>Loading ...</p>
                : gitRepositories?.gitRepositories.filter(
                  (repo: any) => repo.name.includes(repoKeyword))
                  .map((repo: any) =>
                    <div
                      key={repo.id}
                      className="cursor-pointer border border-stone-200
                      my-4 p-4 rounded-2xl flex justify-between items-center"
                    >
                      <p>
                        {repo.url.split('/')[4] + ' / ' +
                          repo.url.split('/')[5]}
                      </p>
                      <button
                        onClick={() => setRepo(repo)}
                        className="bg-stone-700 text-white px-4 py-2 rounded-lg"
                      >
                        Import
                      </button>
                    </div>)}
            </div>

            <div className="my-8">
              <p className="font-extrabold">Git Branches</p>
              <div className="overflow-y-scroll h-64">
                {isLoadingGitRepoBranches
                  ? <p>Loading ...</p> :
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}>
                    {gitRepoBranches?.gitRepoBranches.map(
                      (branchName: string) =>
                        <option
                          key={branchName}
                          value={branchName}
                          className="cursor-pointer"
                          onClick={() => setBranch(branchName)}>
                          {branchName}
                        </option>)}
                  </select>}
              </div>
            </div>

            {(repo && branch) && <button
              onClick={submit}
              className="bg-stone-700 text-white px-4 py-2 rounded-lg"
            >
              Deploy
            </button>}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default DeployNewServicePage;
