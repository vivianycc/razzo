import GithubButton from '@components/GithubButton';
import PageHead from '@components/PageHead';
import Link from 'next/link';
import TopNav from '@components/TopNav';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return <div>
    <PageHead/>
    <TopNav/>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <div className="flex p-8">
        <GithubButton/>
      </div>
      <div className="mb-8">
        <a
          onClick={() => {
            window.open('https://github.com/apps/razzo-app/installations/new',
              'test',
              `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,
              menubar=no,width=720,height=720,left=${window.innerWidth /
              2 - 360},top=${window.innerHeight / 2 - 360}`
            );
          }}>
          <div
            className="bg-[#171515] flex py-2 px-4 rounded-lg
             items-center cursor-pointer">
            <span className="text-white font-bold text-sm">
              Install Razzo GitHub App
            </span>
          </div>
        </a>
      </div>
      <Link href="/projects" passHref>
        <a className="text-blue-600">
          Project List Page
        </a>
      </Link>
    </div>
  </div>;
};

export default Home;
