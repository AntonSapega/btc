import React, { useState, useEffect } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import cn from 'classnames';

import { NumberInput } from 'components';
import { IProfitItem } from 'PlaceOrder/model';
import { QUOTE_CURRENCY } from 'PlaceOrder/constants';

import styles from './ProfitItem.module.scss';

enum fieldNames {
  profit = 'profit',
  target = 'target',
  amount = 'amount',
}

type Props = {
  item: IProfitItem;
  updateItem(id: string, item: IProfitItem): void;
  remove(identifier: string): void;
};

const ProfitItem: React.FC<Props> = ({ item, remove, updateItem }) => {
  const { id, profit: profitProp, target: targetPriceProp, amountToBuy: amountToBuyProp, price } = item;
  const [profit, setProfit] = useState({
    value: 0,
    errorMessages: {
      overLimit: 'Maximum profit sum is 500%',
      lessThanPrevious: "Each target's profit should be greater than the previous one",
      lessThanMinValue: 'Minimum value is 0.01',
    },
  });
  const [targetPrice, setTargetPrice] = useState({
    value: 0,
    errorMessage: 'Price must be greater than 0',
  });
  const [amountToBuy, setAmountToBuy] = useState({
    value: 0,
    errorMessage: 'out of 100% selected. Please decrease by',
  });

  useEffect(() => {
    setProfit((state) => ({
      ...state,
      value: item.profit.value,
    }));

    setTargetPrice((state) => ({
      ...state,
      value: item.target.value,
    }));

    setAmountToBuy((state) => ({
      ...state,
      value: item.amountToBuy.value,
    }));
  }, [item]);

  const profitStyles = cn(styles.field, styles['field__profit']);
  const targetStyles = cn(styles.field, styles['field__target']);
  const amountStyles = cn(styles.field, styles['field__amount']);

  const handleChange = (inputValue: number | null, inputName: string) => {
    if (inputValue === null) return;

    switch (inputName) {
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

  const handleBlur = (fieldName: string) => {
    refreshSelfDataInStore(fieldName);
  };

  const refreshSelfDataInStore = (inputName: string) => {
    let newProfitValue: number = profit.value;
    let newTargetValue: number = targetPrice.value;
    let newAmountToBuy: number = amountToBuy.value;

    switch (inputName) {
      case fieldNames.profit:
        newTargetValue = price + price * (profit.value / 100);
        break;
      case fieldNames.target:
        newProfitValue = price !== 0 ? (100 * (targetPrice.value - price)) / price : profit.value;
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
      <div className={styles.wrapper}>
        <div className={profitStyles}>
          <label className={styles.label} htmlFor="profit-field">
            Profit
          </label>
          <NumberInput
            error={
              profitProp.overLimitError
                ? profit.errorMessages.overLimit
                : profitProp.lessThanPreviousError
                ? profit.errorMessages.lessThanPrevious
                : profitProp.lessThanMinValueError
                ? profit.errorMessages.lessThanMinValue
                : false
            }
            forceOpen={
              profitProp.overLimitError || profitProp.lessThanPreviousError || profitProp.lessThanMinValueError
            }
            id="profit-field"
            value={profit.value}
            variant="underlined"
            InputProps={{ endAdornment: <span className={styles.size}>%</span> }}
            onChange={(value) => handleChange(value, fieldNames.profit)}
            onBlur={() => handleBlur(fieldNames.profit)}
          />
        </div>
        <div className={targetStyles}>
          <label className={styles.label} htmlFor="target-field">
            Target price
          </label>
          <NumberInput
            error={targetPriceProp.isError ? targetPrice.errorMessage : false}
            forceOpen={targetPriceProp.isError}
            id="target-field"
            value={targetPrice.value}
            variant="underlined"
            InputProps={{ endAdornment: <span className={styles.size}>{QUOTE_CURRENCY}</span> }}
            onChange={(value) => handleChange(value, fieldNames.target)}
            onBlur={() => handleBlur(fieldNames.target)}
          />
        </div>
        <div className={amountStyles}>
          <label className={styles.label} htmlFor="amount-field">
            Amount to buy
          </label>
          <NumberInput
            error={
              amountToBuyProp.error !== null
                ? `${amountToBuyProp.error?.currentSum} ${amountToBuy.errorMessage} ${amountToBuyProp.error?.decreaseBy}`
                : false
            }
            forceOpen={amountToBuyProp.error !== null}
            id="amount-field"
            value={amountToBuy.value}
            variant="underlined"
            InputProps={{ endAdornment: <span className={styles.size}>%</span> }}
            onChange={(value) => handleChange(value, fieldNames.amount)}
            onBlur={() => handleBlur(fieldNames.profit)}
          />
        </div>

        <IconButton className={styles.closeBtn} onClick={() => remove(id)}>
          <CancelIcon className={styles.cancelIcon} />
        </IconButton>
      </div>
    </div>
  );
};

export { ProfitItem };
