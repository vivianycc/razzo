import PageHead from '@components/PageHead';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';
import TopNav from '@components/TopNav';
import { useServiceData } from '@stores/services';
import { useProjectData } from '@stores/projects';
import { useDeploymentsData } from '@stores/deployment';
import StatusBadge from '@components/StatusBadge';
import { Button, Input, useToasts } from '@geist-ui/core';
import { useState } from 'react';

const DELETE_SERVICE = gql`
    mutation ($serviceID: ObjectID!) {
        deleteService(_id: $serviceID)
    }
`;

const CREATE_DOMAIN = gql`
    mutation ($projectID: ObjectID!, $serviceID: ObjectID!, $domain: String!) {
        addDomain(
            projectID: $projectID,
            serviceID: $serviceID,
            domain: $domain
        ) {
            _id
            domain
            projectID
            serviceID
            createdAt
        }
    }
`;

const DELETE_DOMAIN = gql`
    mutation ($projectID: ObjectID!, $serviceID: ObjectID!, $domain: String!) {
        removeDomain(
            projectID: $projectID,
            serviceID: $serviceID,
            domain: $domain
        )
    }
`;

function ServiceInfoPage() {

  const router = useRouter();
  const toast = useToasts();
  const {
    projectId,
    serviceId
  } = router.query;
  const { project } = useProjectData(projectId as string | undefined);
  const {
    service,
    revalidate: revalidateService
  } = useServiceData(serviceId as string | undefined);
  const { deployments } = useDeploymentsData(serviceId as string | undefined);

  const [domainInput, setDomainInput] = useState('');
  const [createDomain, { loading: isCreatingDomain }] = useMutation(
    CREATE_DOMAIN);
  const [deleteDomain, { loading: isDeletingDomain }] = useMutation(
    DELETE_DOMAIN);

  const [deleteService] = useMutation(DELETE_SERVICE);

  return <div>
    <PageHead
      title={(service?.name || serviceId) + ' | ' +
        (project?.name || projectId) + ' | Razzo'}
    />
    <TopNav/>
    <div className="container lg:max-w-[1248px] mx-auto py-2 mb-16 px-12">
      <p className="text-5xl mt-8 mb-12">{service?.name}</p>
      <div className="flex gap-6">
        <div>
          <div className="bg-white p-8 rounded-2xl mb-6">
            <p>project: {projectId}</p>
            <p>service: {serviceId}</p>
            <p className="font-bold mt-8">Domains</p>
            {service?.domains.map(
              d => <div
                key={d._id}
              >
                <a
                  href={'https://' + d.domain}
                  className="text-blue-500"
                  target="_blank"
                  rel="noreferrer">
                  <p>{d.domain}</p>
                  <p>{d.status}</p>
                </a>
                <Button
                  loading={isDeletingDomain}
                  onClick={async () => {
                    await deleteDomain({
                      variables: {
                        projectID: projectId as string,
                        serviceID: serviceId as string,
                        domain: d.domain
                      }
                    });
                    await revalidateService();
                  }}>Delete</Button>
              </div>)}
            <Input
              value={domainInput}
              onChange={e => setDomainInput(e.target.value)}
            />
            <Button
              loading={isCreatingDomain}
              onClick={async () => {
                try {
                  await createDomain({
                    variables: {
                      projectID: projectId as string,
                      serviceID: serviceId as string,
                      domain: domainInput
                    }
                  });
                  await revalidateService();
                } catch (err: any) {
                  toast.setToast({
                    type: 'error',
                    text: err.message
                  });
                }
              }}>Add domain</Button>
          </div>
          <div className="bg-white p-8 rounded-2xl h-96">
            <p
              className="text-red-500 cursor-pointer"
              onClick={async () => {
                await deleteService({ variables: { serviceID: serviceId } });
                await router.push('/projects/[projectId]',
                  `/projects/${projectId}`);
              }}>
              Delete Service
            </p>
          </div>
        </div>
        <div className="bg-white flex-grow p-8 rounded-2xl">
          <div>
            <p className="text-3xl text-primary-900">Recent Deploys</p>
            <div>
              {deployments?.map((deployment: any) => {
                return <div key={deployment._id}>
                  <Link
                    href={'/projects/[projectId]/services/[serviceId]' +
                      '/deployments/[deploymentId]'}
                    as={`/projects/${projectId}/services/${serviceId
                    }/deployments/${deployment._id}`}
                  >
                    <div className="my-8 border-b pb-8 flex items-center">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <p className="text-primary-500 font-bold underline">
                            {deployment._id}
                          </p>
                          <StatusBadge
                            status={deployment.status}
                            className="ml-4"/>
                        </div>
                        <p>From GitHub</p>
                        <p className="text-stone-500 text-sm">
                          {deployment.commitMessage}
                        </p>
                      </div>
                      <div>
                        <p className="text-stone-500 font-bold">
                          {new Date(deployment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default ServiceInfoPage;
