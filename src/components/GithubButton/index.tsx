import { GitHub } from 'react-feather';

const clientId = 'd26185ee1e04f7538d25';
const redirectUri = 'https://api.razzo.app/auth/callback';

function GithubButton() {
  return <a href={`https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`}>
    <div className="bg-[#171515] flex py-2 px-4 rounded-lg items-center">
      <GitHub color="white" className="mr-2" size={20} />
      <span className="text-white font-bold text-sm">
        Login with GitHub
      </span>
    </div>
  </a>;
}

export default GithubButton;
