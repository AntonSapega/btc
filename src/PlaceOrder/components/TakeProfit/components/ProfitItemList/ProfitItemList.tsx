import React from 'react';

import { AddNewProfitBtn } from '../AddNewProfitBtn/AddNewProfitBtn';
import { ProfitItem } from '../ProfitItem/ProfitItem';
import { IProfitItem } from 'PlaceOrder/model';

import styles from './ProfitItemList.module.scss';

type Props = {
  list: IProfitItem[];
  addNewItem(): void;
  removeItem(identifier: string): void;
  updateItem(id: string, item: IProfitItem): void;
};

const ProfitItemList: React.FC<Props> = ({ list, addNewItem, removeItem, updateItem }) => {
  return (
    <div className={styles.root}>
      {list.map((item) => (
        <div className={styles['list-item']} key={item.id}>
          <ProfitItem item={item} remove={removeItem} updateItem={updateItem} />
        </div>
      ))}
      {list.length < 5 && (
        <div className={styles.btn}>
          <AddNewProfitBtn handleClick={addNewItem} btnValue={`${list.length} / 5`} />
        </div>
      )}
    </div>
  );
};

export { ProfitItemList };
