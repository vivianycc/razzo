import useDeploymentLogs from './hooks/useDeploymentLogs';
import { Log } from '../../models/log';
import { useState } from 'react';

interface Props {
  deploymentId: string;
}

function BuildLogs(props: Props) {

  const [logs, setLogs] = useState<Log[]>([]);

  useDeploymentLogs({
    deploymentId: props.deploymentId,
    onReceived(log) {
      setLogs(logs => [...logs, log]);
    }
  });

  return <div className="border-2 border-gray-300 rounded-lg p-8">
    {logs.map((log, i) => <p key={i}>
      {log.timestamp.toISOString()} {log.message}
    </p>)}
  </div>;
}

export default BuildLogs;
