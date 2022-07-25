import { NextPageContext } from 'next';

export default function () {
  return <div />;
}

export function getServerSideProps(context: NextPageContext) {
  const tokenBase64 = context.query.result;
  if(tokenBase64 && typeof tokenBase64 === 'string') {
    const token = Buffer.from(tokenBase64, 'base64').toString('ascii');
    context.res?.setHeader(
      'Set-Cookie',
      `token=${token}; path=/; domain=razzo.app`
    );
  }
  return {
    redirect: {
      permanent: false,
      destination: '/projects',
    },
    props:{},
  };}
