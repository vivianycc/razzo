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
      <Link href="/projects" passHref>
        <a className="text-blue-600">
          Project List Page
        </a>
      </Link>
    </div>
  </div>;
};

export default Home;
