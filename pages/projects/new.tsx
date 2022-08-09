import PageHead from '@components/PageHead';
import TopNav from '@components/TopNav';
import { Button, Input, Textarea, useToasts } from '@geist-ui/core';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

const CREATE_PROJECT = gql`
    mutation ($name: String!) {
        createProject(name:$name) {
            _id
        }
    }
`;

function CreateProjectPage() {

  const [createProject, { loading: isLoading }] = useMutation(CREATE_PROJECT);
  const router = useRouter();
  const toast = useToasts();
  const [name, setName] = useState('');

  async function handleCreateProject() {
    try {
      const res = await createProject({ variables: { name } });
      await router.push(`/projects/${res.data.createProject._id}`);
    } catch (err: any) {
      toast.setToast({
        type: 'error',
        text: err.message,
      });
    }
  }

  return <div>
    <PageHead title="Projects | Razzo"/>
    <TopNav/>
    <div className="container lg:max-w-[1248px] mx-auto py-2 mb-16 px-12">
      <p className="text-5xl mt-8 mb-12">Create Project</p>
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="mb-8">
          <p className="text-lg font-bold text-stone-800">Project Name</p>
          <p className="text-stone-500 mt-2 my-4">
            Used to identify your Project on the Dashboard.
          </p>
          <Input
            w={32}
            placeholder="Project Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <p className="text-lg font-bold text-stone-800">
            Project Description
          </p>
          <p className="text-stone-500 mt-2 my-4">
            Used to identify your Project on the Dashboard.
          </p>
          <Textarea w={32} placeholder="Project Description" h={8}/>
        </div>
        <div className="mb-8">
          <p className="text-lg font-bold text-stone-800">
            Project Thumbnail
          </p>
          <p className="text-stone-500 mt-2 my-4">
            Used to identify your Project on the Dashboard.
          </p>
          <img
            className="w-96 h-48 object-cover rounded-xl cursor-pointer"
            alt=""
            src="https://razzo.app/og.png"
          />
          <p className="text-stone-500 text-sm mt-4">
            Razzo is not support change project thumbnail at this time,
            stay tuned!
          </p>
        </div>
        <div className="w-full flex justify-end mt-8">
          <Button loading={isLoading} onClick={handleCreateProject}>
            Create Project
          </Button>
        </div>
      </div>
    </div>
  </div>;
}

export default CreateProjectPage;
