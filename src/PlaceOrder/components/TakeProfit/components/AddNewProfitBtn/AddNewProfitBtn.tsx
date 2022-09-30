import React, { useState } from 'react';

import { TextButton } from 'components';
import iconPath from 'assets/images/add_circle.svg';
import iconHoverPath from 'assets/images/add_circle_hover.svg';

import styles from './AddNewProfitBtn.module.scss';

type Props = {
  btnValue: string;
  handleClick(): void;
};

const AddNewProfitBtn: React.FC<Props> = ({ handleClick, btnValue }) => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <TextButton className={styles.btn} onClick={handleClick} onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
      <img className={styles.btnImg} src={isHover ? iconHoverPath : iconPath} alt="icon" />
      Add profit target {btnValue}
    </TextButton>
  );
};

export { AddNewProfitBtn };
