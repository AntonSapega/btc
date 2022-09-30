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
  name: string;
  isActive: boolean;
  hasError: boolean;
};

type Props = {
  item: IProfitItem;
  updateItem(id: string, item: IProfitItem): void;
  remove(identifier: string): void;
};

const ProfitItem: React.FC<Props> = ({ item, remove, updateItem }) => {
  const { id, profit: profitProp, target: targetPriceProp, amountToBuy: amountToBuyProp, price } = item;

  const [targetPriceValue] = useState(0);

  // const [profit, setProfit] = useState<InputInfo>({
  //   name: fieldNames.profit,
  //   isActive: false,
  //   hasError: false,
  // });
  // const [targetPrice, setTargetPrice] = useState<InputInfo>({
  //   name: fieldNames.target,
  //   isActive: false,
  //   hasError: false,
  // });
  // const [amountToBuy, setAmountToBuy] = useState<InputInfo>({
  //   name: fieldNames.amount,
  //   isActive: false,
  //   hasError: false,
  // });

  // useEffect(() => {
  //   setProfit((state) => ({
  //     ...state,
  //   }));

  //   setTargetPrice((state) => ({
  //     ...state,
  //   }));

  //   setAmountToBuy((state) => ({
  //     ...state,
  //   }));
  // }, [item]);

  const profitStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__profit_active']]: profitProp.isActive });
  const targetStyles = cn(styles['input-wrapper'], {
    [styles['input-wrapper__target_active']]: targetPriceProp.isActive,
  });
  const amountStyles = cn(styles['input-wrapper'], {
    [styles['input-wrapper__amount_active']]: amountToBuyProp.isActive,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    let inputValue: string = event.target.value;

    if (isNaN(Number(inputValue))) return;

    switch (event.target.name) {
      case fieldNames.profit:
        updateItem(id, {
          ...item,
          profit: {
            value: +inputValue,
            isActive: true,
            overLimitError: false,
            lessThanMinValueError: false,
            lessThanPreviousError: false,
          },
        });
        break;
      case fieldNames.target:
        console.log('target field: ', +inputValue);
        updateItem(id, {
          ...item,
          target: {
            value: +inputValue,
            isActive: true,
            isError: false,
          },
        });
        break;
      case fieldNames.amount:
        updateItem(id, {
          ...item,
          amountToBuy: {
            value: +inputValue,
            isActive: true,
            error: null,
          },
        });
        break;
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // invertActiveStatus(event.target.name);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // invertActiveStatus(event.target.name);
    // refreshSelfDataInStore(event.target.name);
  };

  // const invertActiveStatus = (fieldName: string) => {
  //   switch (fieldName) {
  //     case fieldNames.profit:
  //       setProfit((state) => ({
  //         ...state,
  //         isActive: !state.isActive,
  //       }));
  //       break;
  //     case fieldNames.target:
  //       setTargetPrice((state) => ({
  //         ...state,
  //         isActive: !state.isActive,
  //       }));
  //       break;
  //     case fieldNames.amount:
  //       setAmountToBuy((state) => ({
  //         ...state,
  //         isActive: !state.isActive,
  //       }));
  //       break;
  //   }
  // };

  // const refreshSelfDataInStore = (inputName: string) => {
  //   let newProfit: number = +profit.value;
  //   let newTargetValue: number = +targetPrice.value;
  //   let newAmountToBuy: number = +amountToBuy.value;

  //   switch (inputName) {
  //     case fieldNames.profit:
  //       newTargetValue = price + price * (Number(profit.value) / 100);
  //       break;
  //     case fieldNames.target:
  //       newProfit = price !== 0 ? (100 * (Number(targetPrice.value) - price)) / price : +profit.value;
  //       break;
  //   }

  //   const currentProfitItem: IProfitItem = {
  //     id,
  //     price,
  //     profit: newProfit,
  //     target: {
  //       value: newTargetValue,
  //       isError: false,
  //     },
  //     amountToBuy: newAmountToBuy,
  //   };
  //   updateItem(id, currentProfitItem);
  // };

  return (
    <div className={styles.profitItem}>
      <label className={styles.label}>
        <span>Profit</span>
        <div className={profitStyles}>
          <input
            className={styles.input}
            type="text"
            name={fieldNames.profit}
            value={profitProp.value.toString()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          %
        </div>
      </label>
      <label className={styles.label}>
        <span>Target price</span>
        <Tooltip open={targetPriceProp.isError} placement="top" message="Price must be greater than 0" isError>
          <div className={targetStyles}>
            <input
              className={styles.input}
              type="text"
              name={fieldNames.target}
              value={targetPriceValue.toString()}
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
        <div className={amountStyles}>
          <input
            className={styles.input}
            type="text"
            name={fieldNames.amount}
            value={amountToBuyProp.value.toString()}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          %
        </div>
      </label>
      <IconButton className={styles.closeIcon} onClick={() => remove(id)}>
        <CancelIcon style={{ fontSize: '16px' }} />
      </IconButton>
    </div>
  );
};

export { ProfitItem };

/********************************** */
/********************************** */
/********************************** */
/********************************** */
/********************************** */
/********************************** */

// import React, { useState, useEffect } from 'react';
// import CancelIcon from '@material-ui/icons/Cancel';
// import IconButton from '@material-ui/core/IconButton';
// import cn from 'classnames';

// import { Tooltip } from 'components/Tooltip/Tooltip';
// import { IProfitItem } from 'PlaceOrder/model';

// import styles from './ProfitItem.module.scss';

// enum fieldNames {
//   profit = 'profit',
//   target = 'target',
//   amount = 'amount',
// }

// type InputInfo = {
//   name: string;
//   value: string;
//   isActive: boolean;
//   hasError: boolean;
// };

// type Props = {
//   item: IProfitItem;
//   updateItem(id: string, item: IProfitItem): void;
//   remove(identifier: string): void;
// };

// const ProfitItem: React.FC<Props> = ({ item, remove, updateItem }) => {
//   const { id, price } = item;
//   const [profit, setProfit] = useState<InputInfo>({
//     name: fieldNames.profit,
//     value: '0',
//     isActive: false,
//     hasError: false,
//   });
//   const [targetPrice, setTargetPrice] = useState<InputInfo>({
//     name: fieldNames.target,
//     value: '0',
//     isActive: false,
//     hasError: false,
//   });
//   const [amountToBuy, setAmountToBuy] = useState<InputInfo>({
//     name: fieldNames.amount,
//     value: '0',
//     isActive: false,
//     hasError: false,
//   });

//   useEffect(() => {
//     setProfit((state) => ({
//       ...state,
//       value: item.profit.toString(),
//       hasError: false,
//     }));

//     setTargetPrice((state) => ({
//       ...state,
//       value: item.target.value.toString(),
//       hasError: item.target.isError,
//     }));

//     setAmountToBuy((state) => ({
//       ...state,
//       value: item.amountToBuy.toString(),
//       hasError: false,
//     }));
//   }, [item]);

//   const profitStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__profit_active']]: profit.isActive });
//   const targetStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__target_active']]: targetPrice.isActive });
//   const amountStyles = cn(styles['input-wrapper'], { [styles['input-wrapper__amount_active']]: amountToBuy.isActive });

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     event.persist();
//     let inputValue: string = event.target.value;

//     if (isNaN(Number(inputValue))) return;

//     switch (event.target.name) {
//       case fieldNames.profit:
//         setProfit((state) => ({
//           ...state,
//           value: inputValue,
//         }));
//         break;
//       case fieldNames.target:
//         setTargetPrice((state) => ({
//           ...state,
//           value: inputValue,
//         }));
//         break;
//       case fieldNames.amount:
//         setAmountToBuy((state) => ({
//           ...state,
//           value: inputValue,
//         }));
//         break;
//     }
//   };

//   const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
//     invertActiveStatus(event.target.name);
//   };

//   const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
//     invertActiveStatus(event.target.name);
//     refreshSelfDataInStore(event.target.name);
//   };

//   const invertActiveStatus = (fieldName: string) => {
//     switch (fieldName) {
//       case fieldNames.profit:
//         setProfit((state) => ({
//           ...state,
//           isActive: !state.isActive,
//         }));
//         break;
//       case fieldNames.target:
//         setTargetPrice((state) => ({
//           ...state,
//           isActive: !state.isActive,
//         }));
//         break;
//       case fieldNames.amount:
//         setAmountToBuy((state) => ({
//           ...state,
//           isActive: !state.isActive,
//         }));
//         break;
//     }
//   };

//   const refreshSelfDataInStore = (inputName: string) => {
//     let newProfit: number = +profit.value;
//     let newTargetValue: number = +targetPrice.value;
//     let newAmountToBuy: number = +amountToBuy.value;

//     switch (inputName) {
//       case fieldNames.profit:
//         newTargetValue = price + price * (Number(profit.value) / 100);
//         break;
//       case fieldNames.target:
//         newProfit = price !== 0 ? (100 * (Number(targetPrice.value) - price)) / price : +profit.value;
//         break;
//     }

//     const currentProfitItem: IProfitItem = {
//       id,
//       price,
//       profit: newProfit,
//       target: {
//         value: newTargetValue,
//         isError: false,
//       },
//       amountToBuy: newAmountToBuy,
//     };
//     updateItem(id, currentProfitItem);
//   };

//   return (
//     <div className={styles.profitItem}>
//       <label className={styles.label}>
//         <span>Profit</span>
//         <div className={profitStyles}>
//           <input
//             className={styles.input}
//             type="text"
//             name={fieldNames.profit}
//             value={profit.value}
//             onChange={handleChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           %
//         </div>
//       </label>
//       <label className={styles.label}>
//         <span>Target price</span>
//         <Tooltip open={targetPrice.hasError} placement="top" message="Price must be greater than 0" isError>
//           <div className={targetStyles}>
//             <input
//               className={styles.input}
//               type="text"
//               name={fieldNames.target}
//               value={targetPrice.value}
//               onChange={handleChange}
//               onFocus={handleFocus}
//               onBlur={handleBlur}
//             />
//             USDT
//           </div>
//         </Tooltip>
//       </label>
//       <label className={styles.label}>
//         <span>Amount to buy</span>
//         <div className={amountStyles}>
//           <input
//             className={styles.input}
//             type="text"
//             name={fieldNames.amount}
//             value={amountToBuy.value}
//             onChange={handleChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           %
//         </div>
//       </label>
//       <IconButton className={styles.closeIcon} onClick={() => remove(id)}>
//         <CancelIcon style={{ fontSize: '16px' }} />
//       </IconButton>
//     </div>
//   );
// };

// export { ProfitItem };
