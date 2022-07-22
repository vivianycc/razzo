import { Log, parseLog } from '../../../models/log';
import { gql, useSubscription } from '@apollo/client';

const SUBSCRIPTION_BUILD_LOG = gql`
  subscription ($deploymentId: ID!) {
    buildLogReceived(deploymentID: $deploymentId) {
		id
		timestamp
		level
		message
	}
  }
`;

interface useDeploymentLogsOptions {
  deploymentId: string;
  onReceived: (log: Log) => void;
}

function useDeploymentLogs(opt: useDeploymentLogsOptions) {
  const { deploymentId, onReceived } = opt;
  return useSubscription(SUBSCRIPTION_BUILD_LOG, {
    variables: { deploymentId },
    onSubscriptionData: ({ subscriptionData }: any) => {
      onReceived(parseLog(subscriptionData.data.buildLogReceived));
    },
  });
}

export default useDeploymentLogs;
