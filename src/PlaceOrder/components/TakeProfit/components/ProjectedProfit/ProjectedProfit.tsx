import React from 'react';

import styles from './ProjectedProfit.module.scss';

type Props = {
  expectedProfit: number;
};

const ProjectedProfit: React.FC<Props> = ({ expectedProfit }) => {
  return (
    <div className={styles.root}>
      <span className={styles.title}>Projected profit</span>
      <span className={styles.revenue}>
        {expectedProfit}
        <span className={styles.currency}> USDT</span>
      </span>
    </div>
  );
};

export { ProjectedProfit };
