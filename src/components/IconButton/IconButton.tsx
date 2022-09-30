import React from 'react';
import { IconButton as MUIIconBtn, IconButtonProps } from '@material-ui/core';

import styles from './IconButton.module.scss';

type Props = IconButtonProps;

const IconButton: React.FC<Props> = ({ children, ...rest }) => <MUIIconBtn {...rest}>{children}</MUIIconBtn>;

export { IconButton };
