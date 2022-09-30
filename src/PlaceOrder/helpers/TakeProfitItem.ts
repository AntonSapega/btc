import { v4 as uuid } from 'uuid';
import { IProfitItem, ITargetPrice, IProfit, IAmountToBuy } from '../model';

export class TakeProfitItem implements IProfitItem {
  id: string = uuid();
  profit: IProfit;
  target: ITargetPrice;
  amountToBuy: IAmountToBuy;

  constructor(public profitValue: number, public price: number, public amountToBuyValue: number) {
    this.profit = {
      value: profitValue,
      isActive: false,
      overLimitError: false,
      lessThanMinValueError: false,
      lessThanPreviousError: false,
    };
    this.target = {
      value: price + price * (profitValue / 100),
      isActive: false,
      isError: false,
    };
    this.amountToBuy = {
      value: amountToBuyValue,
      isActive: false,
      error: null,
    };
    this.price = price;
  }
}
