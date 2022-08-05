import { DeploymentStatus } from '@models/deployment';

function StatusBadge({ status }: { status: DeploymentStatus }) {
  switch (status) {
    case DeploymentStatus.RUNNING:
      return (
        <div className="bg-teal-100 text-teal-700 px-4 py-1 rounded-full mt-2">
          Running
        </div>
      );
    case DeploymentStatus.BUILDING:
      return (
        <div
          className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full mt-2">
          Building
        </div>
      );
    case DeploymentStatus.REMOVED:
      return (
        <div
          className="bg-stone-200 text-stone-400 px-4 py-1 rounded-full mt-2">
          Removed
        </div>
      );
    case DeploymentStatus.FAILED:
      return (
        <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full mt-2">
          Failed
        </div>
      );
    case DeploymentStatus.CRASHED:
      return (
        <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full mt-2">
          Crashed
        </div>
      );
    default:
      return null;
  }
}

export default StatusBadge;
