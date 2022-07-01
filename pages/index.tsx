import { GitHub } from 'react-feather';
import Head from 'next/head';
import type { NextPage } from 'next';

const clientId = 'd26185ee1e04f7538d25';
const redirectUri = 'https://api.razzo.app/auth/callback';

const Home: NextPage = () => {
  return <div>
    <Head>
      <title>Razzo</title>
      <meta name="description" content="Deploy your services gracefully." />
      <link rel="icon" href="/favicon.png" />
      <meta property="og:image" content="/og.png" />
      <meta property="twitter:card" content="summary_large_image"></meta>
    </Head>
    <div
      className="w-screen h-screen flex justify-center
     items-center flex-col">
      <img src="/logo.png" className="w-36" alt="razzo" />
      <div className="flex p-8">
        <a href={`https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`}>
          <div className="bg-[#171515] flex py-2 px-4 rounded-lg items-center">
            <GitHub color="white" className="mr-2" size={20} />
            <span className="text-white font-bold text-sm">
              Login with GitHub
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>;
};

export default Home;
