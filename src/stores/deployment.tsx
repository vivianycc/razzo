import { proxyMap } from 'valtio/utils';
import { gql, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import Deployment from '@models/deployment';

const deploymentStore = proxyMap<string, Deployment>();

/** We maintain a map to record the mapping relationship between project ID
 * and it's services ID, this speed up the query time on specific projectID */
const serviceDeploymentMapping = proxyMap<string, Set<string>>();

/** Save new service data into Valtio store */
export function updateDeploymentData(data: Deployment | Deployment[]) {
  if (Array.isArray(data)) data.forEach(_mergeUpdate);
  else _mergeUpdate(data);
}

/** Merge the old data with new data, because there may be some missing field
 * in new data due to GraphQL query field selection */
function _mergeUpdate(data: Deployment) {
  const old = deploymentStore.get(data._id);
  if (old) deploymentStore.set(data._id, { ...old, ...data });
  else deploymentStore.set(data._id, data);
  if (data?.serviceId) {
    const oldSet = serviceDeploymentMapping.get(data.serviceId);
    if (oldSet) {
      oldSet.add(data._id);
      serviceDeploymentMapping.set(data.serviceId, oldSet);
    } else {
      serviceDeploymentMapping.set(data.serviceId, new Set([data._id]));
    }
  }
}

const QUERY_DEPLOYMENTS = gql`
    query ($serviceId: ObjectID!) {
        deployments(serviceID: $serviceId) {
            edges {
                node {
                    _id
                    status
                    commitMessage
                    commitSHA
                    createdAt
                }
            }
        }
    }
`;

export function useDeploymentsData(serviceId: string | undefined) {
  const { data } = useQuery(QUERY_DEPLOYMENTS, {
    variables: { serviceId },
    skip: !serviceId
  });
  const serviceSnap = useSnapshot(deploymentStore);
  const mapping = useSnapshot(serviceDeploymentMapping);
  const serviceDeploymentIds = serviceId
    ? mapping.get(serviceId) || []
    : [];

  useEffect(() => {
    if (data?.deployments) updateDeploymentData(
      data.deployments.edges.map((e: any) => ({
        ...e.node,
        serviceId
      })));
  }, [data]);

  const deployments = useMemo(() => {
    const res: Deployment[] = [];
    serviceDeploymentIds.forEach(id => {
      const service = serviceSnap.get(id);
      if (service) res.push(service);
    });
    return res;
  }, [serviceDeploymentIds, serviceSnap]);

  return { deployments };
}

export default deploymentStore;
