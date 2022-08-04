import { proxyMap } from 'valtio/utils';
import { gql, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import Service from '@models/service';

const serviceStore = proxyMap<string, Service>();

/** We maintain a map to record the mapping relationship between project ID
 * and it's services ID, this speed up the query time on specific projectID */
const projectServiceMapping = proxyMap<string, string[]>();

/** Save new service data into Valtio store */
export function updateServiceData(data: Service | Service[]) {
  if (Array.isArray(data)) data.forEach(_mergeUpdate);
  else _mergeUpdate(data);
}

/** Merge the old data with new data, because there may be some missing field
 * in new data due to GraphQL query field selection */
function _mergeUpdate(data: Service) {
  console.log('_mergeUpdate', data);
  const old = serviceStore.get(data._id);
  if (old) serviceStore.set(data._id, { ...old, ...data });
  else serviceStore.set(data._id, data);
  if (data?.project?._id) {
    projectServiceMapping.set(data.project._id,
      [...projectServiceMapping.get(data.project._id) || [], data._id]);
  }
}

const QUERY_PROJECT = gql`
    query($serviceId: ObjectID!) {
        service(_id: $serviceId) {
            _id
            name
            gitProvider
            repoOwner
            repoName
            project {
                _id
            }
        }
    }
`;

export function useServiceData(serviceId: string | undefined) {

  const { data } = useQuery(QUERY_PROJECT, { variables: { serviceId } });
  const serviceSnap = useSnapshot(serviceStore);

  useEffect(() => {
    if (data?.project) updateServiceData(data.project);
  }, [data]);

  return { service: serviceId ? serviceSnap.get(serviceId) : undefined };
}

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

export function useServicesData(projectId: string | undefined) {
  const { data } = useQuery(QUERY_SERVICES, { variables: { projectId } });
  const serviceSnap = useSnapshot(serviceStore);
  const serviceMapping = useSnapshot(projectServiceMapping);
  const projectServiceIds = projectId
    ? serviceMapping.get(projectId) || []
    : [];

  useEffect(() => {
    if (data?.services) updateServiceData(
      data.services.edges.map((e: any) => ({
        ...e.node,
        // inject the project id because we already know it
        // thus don't need to query from server
        project: { _id: projectId }
      })));
  }, [data]);

  const services = useMemo(() => {
    const res: Service[] = [];
    projectServiceIds.forEach(id => {
      const service = serviceSnap.get(id);
      if (service) res.push(service);
    });
    return res;
  }, [projectServiceIds, serviceSnap]);

  return { services };
}

export default serviceStore;
