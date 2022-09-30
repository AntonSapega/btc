import React, { useState, useEffect } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import cn from 'classnames';

import { Tooltip } from 'components/Tooltip/Tooltip';
import { IProfitItem } from 'PlaceOrder/model';

import styles from './ProfitItem.module.scss';

enum fieldNames {
  profit = 'profit',
  target = 'target',
  amount = 'amount',
}

type InputInfo = {
  value: string;
  isActive: boolean;
};

type Props = {
  item: IProfitItem;
  updateItem(id: string, item: IProfitItem): void;
  remove(identifier: string): void;
};

const ProfitItem: React.FC<Props> = ({ item, remove, updateItem }) => {
  const { id, profit: profitProp, target: targetPriceProp, amountToBuy: amountToBuyProp, price } = item;
  const [profit, setProfit] = useState<InputInfo>({
    value: '0',
    isActive: false,
  });
  const [targetPrice, setTargetPrice] = useState<InputInfo>({
    value: '0',
    isActive: false,
  });
  const [amountToBuy, setAmountToBuy] = useState<InputInfo>({
    value: '0',
    isActive: false,
  });

  useEffect(() => {
    setProfit((state) => ({
      ...state,
      value: item.profit.value.toString(),
    }));

    setTargetPrice((state) => ({
      ...state,
      value: item.target.value.toString(),
    }));

    setAmountToBuy((state) => ({
      ...state,
      value: item.amountToBuy.value.toString(),
    }));
  }, [item]);

  const profitStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__profit_active']]: profit.isActive });
  const targetStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__target_active']]: targetPrice.isActive });
  const amountStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__amount_active']]: amountToBuy.isActive });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    let inputValue: string = event.target.value;

    if (isNaN(Number(inputValue))) return;

    switch (event.target.name) {
      case fieldNames.profit:
        setProfit((state) => ({
          ...state,
          value: inputValue,
        }));
        break;
      case fieldNames.target:
        setTargetPrice((state) => ({
          ...state,
          value: inputValue,
        }));
        break;
      case fieldNames.amount:
        setAmountToBuy((state) => ({
          ...state,
          value: inputValue,
        }));
        break;
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    invertActiveStatus(event.target.name);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    invertActiveStatus(event.target.name);
    refreshSelfDataInStore(event.target.name);
  };

  const invertActiveStatus = (fieldName: string) => {
    switch (fieldName) {
      case fieldNames.profit:
        setProfit((state) => ({
          ...state,
          isActive: !state.isActive,
        }));
        break;
      case fieldNames.target:
        setTargetPrice((state) => ({
          ...state,
          isActive: !state.isActive,
        }));
        break;
      case fieldNames.amount:
        setAmountToBuy((state) => ({
          ...state,
          isActive: !state.isActive,
        }));
        break;
    }
  };

  const refreshSelfDataInStore = (inputName: string) => {
    let newProfitValue: number = +profit.value;
    let newTargetValue: number = +targetPrice.value;
    let newAmountToBuy: number = +amountToBuy.value;

    switch (inputName) {
      case fieldNames.profit:
        newTargetValue = price + price * (Number(profit.value) / 100);
        break;
      case fieldNames.target:
        newProfitValue = price !== 0 ? (100 * (Number(targetPrice.value) - price)) / price : +profit.value;
        break;
    }

    const currentProfitItem: IProfitItem = {
      id,
      price,
      profit: {
        value: newProfitValue,
        isActive: false,
        overLimitError: false,
        lessThanMinValueError: false,
        lessThanPreviousError: false,
      },
      target: {
        value: newTargetValue,
        isActive: false,
        isError: false,
      },
      amountToBuy: {
        value: newAmountToBuy,
        isActive: false,
        error: null,
      },
    };
    updateItem(id, currentProfitItem);
  };

  return (
    <div className={styles.profitItem}>
      <label className={styles.label}>
        <span>Profit</span>
        <Tooltip
          open={profitProp.overLimitError || profitProp.lessThanPreviousError || profitProp.lessThanMinValueError}
          placement="top"
          message={
            profitProp.overLimitError
              ? 'Maximum profit sum is 500%'
              : profitProp.lessThanPreviousError
              ? "Each target's profit should be greater than the previous one"
              : 'Minimum value is 0.01'
          }
          isError
        >
          <div className={profitStyles}>
            <input
              className={styles.input}
              type="text"
              autoComplete="off"
              name={fieldNames.profit}
              value={profit.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            %
          </div>
        </Tooltip>
      </label>
      <label className={styles.label}>
        <span>Target price</span>
        <Tooltip open={targetPriceProp.isError} placement="top" message="Price must be greater than 0" isError>
          <div className={targetStyles}>
            <input
              className={styles.input}
              type="text"
              autoComplete="off"
              name={fieldNames.target}
              value={targetPrice.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            USDT
          </div>
        </Tooltip>
      </label>
      <label className={styles.label}>
        <span>Amount to buy</span>
        <Tooltip
          open={amountToBuyProp.error !== null}
          placement="top"
          message={`${amountToBuyProp.error?.currentSum} out of 100% selected. Please decrease by ${amountToBuyProp.error?.decreaseBy}`}
          isError
        >
          <div className={amountStyles}>
            <input
              className={styles.input}
              type="text"
              autoComplete="off"
              name={fieldNames.amount}
              value={amountToBuy.value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            %
          </div>
        </Tooltip>
      </label>
      <IconButton className={styles.closeIcon} onClick={() => remove(id)}>
        <CancelIcon style={{ fontSize: '16px' }} />
      </IconButton>
    </div>
  );
};

export { ProfitItem };
