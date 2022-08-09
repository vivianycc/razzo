import useDeploymentLogs from './hooks/useDeploymentLogs';
import { Log } from '@models/log';
import { useRef, useState } from 'react';

interface Props {
  deploymentId: string;
}

function BuildLogs(props: Props) {

  const [logs, setLogs] = useState<Log[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useDeploymentLogs({
    deploymentId: props.deploymentId,
    onReceived(log) {
      setLogs(logs => [...logs, log]);
      ref.current?.scroll({
        top: ref.current?.scrollHeight,
        behavior: 'smooth'
      });
    }
  });

  return <div
    ref={ref}
    className="rounded-lg p-8 bg-gray-100 font-mono
    text-stone-800 leading-8 text-sm max-h-[32rem] overflow-y-scroll">
    {logs.map((log, i) => <p key={i}>
      {log.timestamp.toISOString()} {log.message}
    </p>)}
  </div>;
}

export default BuildLogs;
