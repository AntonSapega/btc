import React from 'react';

import { SvgIcon as MUISvgIcon, SvgIconProps } from '@material-ui/core';

// import { Icon }

type Props = SvgIconProps & { component: JSX.Element };

const SvgIcon: React.FC<Props> = ({ children, component, ...rest }) => {
  return <MUISvgIcon {...rest}>{children}</MUISvgIcon>;
};

export { SvgIcon };
