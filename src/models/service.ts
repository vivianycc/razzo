import Project from '@models/project';

interface Service {
  _id: string;
  name: string;
  gitProvider: 'GITHUB' | 'GITLAB' | 'BITBUCKET';
  repoOwner: string;
  repoName: string;
  project: Project;
}

export default Service;
