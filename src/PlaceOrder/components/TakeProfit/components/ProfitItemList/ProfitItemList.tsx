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
        <ProfitItem key={item.id} item={item} remove={removeItem} updateItem={updateItem} />
      ))}
      {list.length < 5 && (
        <TextButton
          onClick={() => addNewField()}
          style={{ marginTop: '20px', fontSize: '15px' }}
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
