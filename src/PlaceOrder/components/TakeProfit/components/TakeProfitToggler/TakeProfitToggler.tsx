import React from 'react';

import { Tooltip } from 'components/Tooltip/Tooltip';
import { Image } from 'components/Image/Image';
import { Switch } from 'components/Switch/Switch';
import pathToImg from 'assets/images/question-sign.svg';

import styles from './TakeProfitToggler.module.scss';

type Props = {
  checked: boolean;
  toggle: (status: boolean) => void;
};

const TakeProfitToggler: React.FC<Props> = ({ checked, toggle }) => {
  return (
    <div className={styles.root}>
      <section className={styles.title}>
        <h4 className={styles.title}>Take Profit</h4>
        <Tooltip message="Description about Take Profit settings" placement="top">
          <div className={styles.hint}>
            <Image path={pathToImg} alt="question sign tooltip" />
          </div>
        </Tooltip>
      </section>
      <Switch checked={checked} onChange={(status) => toggle(status)} />
    </div>
  );
};

export { TakeProfitToggler };
