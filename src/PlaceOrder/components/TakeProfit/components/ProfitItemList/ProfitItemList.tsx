import React, { useState } from 'react';

import { TextButton } from 'components';
import { ProfitItem } from '../ProfitItem/ProfitItem';
import { IProfitItem } from 'PlaceOrder/model';
import iconPath from 'assets/images/add_circle.svg';
import iconHoverPath from 'assets/images/add_circle_hover.svg';

import styles from './ProfitItemList.module.scss';

type Props = {
  list: IProfitItem[];
  addNewField(): void;
  removeItem(identifier: string): void;
  updateItem(id: string, item: IProfitItem): void;
};

const ProfitItemList: React.FC<Props> = ({ list, addNewField, removeItem, updateItem }) => {
  const [isHover, setIsHover] = useState(false);

  const handleHover = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <div className={styles.root}>
      {list.map((item) => (
        <div className={styles['list-item']} key={item.id}>
          <ProfitItem item={item} remove={removeItem} updateItem={updateItem} />
        </div>
      ))}
      {list.length < 5 && (
        <TextButton
          className={styles.btn}
          onClick={() => addNewField()}
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
        >
          <img
            style={{
              height: '16px',
              width: '16px',
              marginRight: '6px',
            }}
            src={isHover ? iconHoverPath : iconPath}
            alt="icon"
          />
          Add profit target {list.length} / 5
        </TextButton>
      )}
    </div>
  );
};

export { ProfitItemList };
