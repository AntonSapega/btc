import React from 'react';

type Props = { path: string; alt: string };

const Image: React.FC<Props> = ({ path, alt }) => {
  return <img src={path} alt={alt} />;
};

export { Image };
