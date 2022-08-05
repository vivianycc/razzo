import { DeploymentStatus } from '@models/deployment';
import cx from 'classnames';

interface Props {
  status: DeploymentStatus;
  className?: string;
}

function StatusBadge(props: Props) {

  const {
    status,
    className
  } = props;

  const commonClassNames = cx('px-4 py-1 rounded-full h-8', className);

  switch (status) {
    case DeploymentStatus.RUNNING:
      return (
        <div className={cx('bg-teal-100 text-teal-700', commonClassNames)}>
          Running
        </div>
      );
    case DeploymentStatus.BUILDING:
      return (
        <div className={cx('bg-orange-100 text-orange-700', commonClassNames)}>
          Building
        </div>
      );
    case DeploymentStatus.REMOVED:
      return (
        <div className={cx('bg-stone-200 text-stone-400', commonClassNames)}>
          Removed
        </div>
      );
    case DeploymentStatus.FAILED:
      return (
        <div className={cx('bg-red-100 text-red-700', commonClassNames)}>
          Failed
        </div>
      );
    case DeploymentStatus.CRASHED:
      return (
        <div className={cx('bg-red-100 text-red-700', commonClassNames)}>
          Crashed
        </div>
      );
    default:
      return null;
  }
}

export default StatusBadge;
