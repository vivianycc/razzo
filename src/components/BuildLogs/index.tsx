import useDeploymentLogs from './hooks/useDeploymentLogs';
import { Log } from '@models/log';
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
      window.scroll({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  });

  return <div
    className="rounded-lg p-8 bg-gray-100 font-mono
    text-stone-800 leading-8 text-sm">
    {logs.map((log, i) => <p key={i}>
      {log.timestamp.toISOString()} {log.message}
    </p>)}
  </div>;
}

export default BuildLogs;
