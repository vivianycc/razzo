import Head from 'next/head';

interface Props {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	icon?: string;
}

const defaultValue: Props = {
  title: 'Razzo',
  description: 'Deploy your services gracefully.',
  image: '/og.png',
  url: '/',
  icon: '/favicon.png',
};

function PageHead(props: Props) {
  props = {
    title: props.title || defaultValue.title,
    description: props.description || defaultValue.description,
    image: props.image || defaultValue.image,
    url: props.url || defaultValue.url,
    icon: props.icon || defaultValue.icon,
  };

  return <Head>
    <title>{props.title}</title>
    <meta name="description" content={props.description} />
    <link rel="icon" href={props.icon} />
    <meta property="og:image" content={props.image} />
    <meta property="twitter:card" content="summary_large_image"></meta>
  </Head>;
}

export default PageHead;
