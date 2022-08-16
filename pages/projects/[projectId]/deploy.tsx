import PageHead from '@components/PageHead';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import TopNav from '@components/TopNav';
import { Button, Input, Select, Spinner } from '@geist-ui/core';

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
  const [isInstalledApp, setInstalledApp] = useState(true);

  const { data: gitNamespaces, } = useQuery(QUERY_GIT_NAMESPACE,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data.gitNamespaces.length === 0) {
          setInstalledApp(false);
        }
      }
    });

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
    onCompleted: (data) => {
      setBranch(data.gitRepoBranches[0]);
    },
    skip: !repo
  });

  const [createService, { loading: isCreating }] = useMutation(CREATE_SERVICE);

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
    if (!namespaceID && gitNamespaces?.gitNamespaces.length > 0)
      setNamespaceID(gitNamespaces?.gitNamespaces[0].id.toString());
  }, [gitNamespaces?.gitNamespaces]);

  return <div>
    <PageHead title={projectId + ' | Razzo'}/>
    <TopNav/>
    <div className="container lg:max-w-[1248px] mx-auto py-2 mb-16 px-12">
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

            <div className="my-8 flex">
              <a
                onClick={() => {
                  window.open(
                    'https://github.com/apps/razzo-app/installations/new',
                    'test',
                    `scrollbars=no,resizable=no,status=no,location=no,
                    toolbar=no,menubar=no,width=720,height=720,
                    left=${window.innerWidth / 2 - 360},
                    top=${window.innerHeight / 2 - 360}`
                  );
                }}>
                <div
                  className="bg-[#171515] flex py-2 px-4 rounded-lg
             items-center cursor-pointer">
                  <span className="text-white font-bold text-sm">
                    Install Razzo GitHub App
                  </span>
                </div>
              </a>
            </div>

            {isInstalledApp && <div className="flex mt-8">
              <Select
                disabled={!gitNamespaces || !namespaceID}
                value={namespaceID}
                onChange={v => setNamespaceID(v as string)}>
                {gitNamespaces?.gitNamespaces.map(
                  (namespace: any) => <Select.Option
                    key={namespace.id.toString()}
                    value={namespace.id.toString()}
                  >
                    {namespace.name}
                  </Select.Option>)}
              </Select>
              <Input
                w="100%"
                ml={1}
                placeholder="Search Repositories"
                value={repoKeyword}
                onChange={e => setRepoKeyword(e.target.value)}
              />
            </div>}

            <div className="overflow-y-scroll max-h-[16rem] mt-4">
              {isLoadingGitRepos ? <Spinner/>
                : gitRepositories?.gitRepositories.filter(
                  (repo: any) => repo.name.includes(repoKeyword))
                  .map((repo: any) =>
                    <div
                      key={repo.id}
                      className="cursor-pointer border border-stone-200
                      mb-4 p-4 rounded-2xl flex justify-between items-center"
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

            {repo && <div className="my-8">
              <p className="font-extrabold">Git Branches</p>
              <div className="overflow-y-scroll my-4">
                <Select
                  disabled={isLoadingGitRepoBranches}
                  value={branch}
                  onChange={v => setBranch(v as string)}
                >
                  {gitRepoBranches?.gitRepoBranches.map(
                    (branchName: string) =>
                      <Select.Option key={branchName} value={branchName}>
                        {branchName}
                      </Select.Option>)}
                </Select>
              </div>
            </div>}

            {(repo && branch) && <Button loading={isCreating} onClick={submit}>
              Deploy
            </Button>}
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default DeployNewServicePage;
