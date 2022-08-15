import { Button, Page, Text, Grid, Card } from '@geist-ui/core';

export default function ServiceCard({
  color = 'pink',
  status = 'running',
  name = 'service name',
  deployTime = '07/25 16:00',
  gitProvider = 'github',
  deployStatus = 'deploying',
  ...props
}) {
  return (
    <Card
      shadow
      hoverable
      style={{ borderRadius: '16px', backgroundColor: '#FFF' }}
    >
      <Card.Content className="flex">
        <div className="bg-primary-100 w-16 h-16 rounded-lg">
          <img src="/logo-s-mono.svg" alt="" />
        </div>
        <div className="ml-3">
          <span className="flex items-center gap-2 capitalize before:content-[''] before:block before:w-3 before:h-3 before:bg-green-300 before:rounded-full ">
            {status}
          </span>
          <p className="mt-2 mb-1 text-lg font-bold capitalize">{name}</p>
          <p className="my-1 text-sm"> Deployed at {deployTime}</p>
          <p className="my-1 text-sm text-gray-400">from {gitProvider}</p>
          {deployStatus == 'deploying' ? (
            <p className="my-1 py-1 px-2 rounded border border-orange-200 bg-orange-200/20 text-sm text-orange-400">
              New Deploy Ongoing
            </p>
          ) : null}
        </div>
      </Card.Content>
    </Card>
  );
}
