export enum DeploymentStatus {
  RUNNING = 'running',
  BUILDING = 'building',
  CRASHED = 'crashed',
  FAILED = 'failed',
  REMOVED = 'removed',
}

interface Deployment {
  _id: string;
  serviceId: string;
  repoOwner: string;
  repoName: string;
  branchName: string;
  createdAt: Date;
  commitMessage: string;
  status: DeploymentStatus;
}

export default Deployment;
