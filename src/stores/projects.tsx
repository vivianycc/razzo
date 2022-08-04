import { proxyMap } from 'valtio/utils';
import Project from '@models/project';
import { gql, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

const projectStore = proxyMap<string, Project>();

/** Save new project data into Valtio store */
export function updateProjectData(data: Project | Project[]) {
  if (Array.isArray(data)) data.forEach(_mergeUpdate);
  else _mergeUpdate(data);
}

/** Merge the old data with new data, because there may be some missing field
 * in new data due to GraphQL query field selection */
function _mergeUpdate(data: Project) {
  const old = projectStore.get(data._id);
  if (old) projectStore.set(data._id, { ...old, ...data });
  else projectStore.set(data._id, data);
}

const QUERY_PROJECT = gql`
    query($projectId: ObjectID!) {
        project(_id: $projectId) {
            _id
            name
            owner {
                _id
                email
                name
            }
        }
    }
`;

export function useProjectData(projectId: string | undefined) {

  const projectSnap = useSnapshot(projectStore);
  const cached = projectId ? projectSnap.get(projectId) : undefined;

  const {
    data,
    refetch: revalidate
  } = useQuery(QUERY_PROJECT, {
    variables: { projectId },
    skip: !projectId || !!cached
  });

  useEffect(() => {
    if (data?.project) updateProjectData(data.project);
  }, [data]);

  return {
    project: cached,
    revalidate
  };
}

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

export function useProjectsData() {
  const projectSnap = useSnapshot(projectStore);

  const {
    data,
    refetch: revalidate
  } = useQuery(QUERY_PROJECTS, { skip: projectSnap.size > 0 });

  useEffect(() => {
    if (data?.projects) updateProjectData(
      data.projects.edges.map((e: any) => e.node));
  }, [data]);

  return {
    projects: projectSnap,
    revalidate
  };
}

export default projectStore;
