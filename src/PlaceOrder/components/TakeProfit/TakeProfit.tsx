/* eslint @typescript-eslint/no-use-before-define: 0 */
import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { TakeProfitToggler } from './components/TakeProfitToggler/TakeProfitToggler';
import { ProfitItemList } from './components/ProfitItemList/ProfitItemList';
import { ProjectedProfit } from './components/ProjectedProfit/ProjectedProfit';
import { useStore } from '../../context';

import styles from './TakeProfit.module.scss';
import { IProfitItem } from '../../model';

const TakeProfit = observer(() => {
  const {
    profitList,
    initTakeProfitList,
    clearTakeProfitList,
    addTakeProfitItem,
    removeTakeProfitItem,
    updateTakeProfitItem,
    projectedProfit,
  } = useStore();
  const [isToggleOn, setIsToggleOn] = useState<boolean>(false);

  const handleSwitch = (v: boolean) => {
    if (v) initTakeProfitList();
    if (!v) clearTakeProfitList();
    setIsToggleOn(v);
  };

  const handleAddNewField = () => {
    addTakeProfitItem();
  };

  const removeProfitItem = (identifier: string) => {
    removeTakeProfitItem(identifier);
  };

  const handleUpdateItem = (id: string, profitItem: IProfitItem) => {
    updateTakeProfitItem(id, profitItem);
  };

  return (
    <div className={styles.root}>
      <TakeProfitToggler checked={isToggleOn} toggle={(value) => handleSwitch(value)} />
      {isToggleOn && (
        <ProfitItemList
          list={profitList}
          addNewItem={handleAddNewField}
          removeItem={removeProfitItem}
          updateItem={handleUpdateItem}
        />
      )}
      <ProjectedProfit expectedProfit={projectedProfit} />
    </div>
  );
});

export { TakeProfit };
