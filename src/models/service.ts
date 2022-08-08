import Project from '@models/project';

interface Domain {
  _id: string;
  domain: string;
}

interface Service {
  _id: string;
  name: string;
  gitProvider: 'GITHUB' | 'GITLAB' | 'BITBUCKET';
  repoOwner: string;
  repoName: string;
  project: Project;
  domains: Domain[];
}

export default Service;
