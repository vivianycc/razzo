import useDeploymentLogs from './hooks/useDeploymentLogs';
import { Log } from '../../models/log';
import { useState } from 'react';

function BuildLogs() {

  const [logs, setLogs] = useState<Log[]>([]);

  useDeploymentLogs({
    deploymentId: '62d922a46d97ed230c89369f',
    onReceived(log) {
      setLogs(logs => [...logs, log]);
    }
  });

  return <div className="border-2 border-gray-300 rounded-lg p-8">
    {logs.map(log => <p key={log.id}>
      {log.level} {log.timestamp.toISOString()} {log.message}
    </p>)}
  </div>;
}

export default BuildLogs;
