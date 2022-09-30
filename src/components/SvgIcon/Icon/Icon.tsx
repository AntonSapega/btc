import React from 'react';

type Props = {
  path: string;
  imgAlt: string;
};

const Icon: React.FC<Props> = ({ path, imgAlt }) => {
  return <img src={path} alt={imgAlt} />;
};

export { Icon };
