export type OrderSide = 'buy' | 'sell';

export type Profit = {
  profit: number;
  targetPrice: number;
  amountToBuy: number;
};

export interface IProfitItem {
  id: string;
  profit: IProfit;
  target: ITargetPrice;
  amountToBuy: IAmountToBuy;
  price: number;
}

export interface IProfit {
  value: number;
  isActive: boolean;
  overLimitError: boolean;
  lessThanMinValueError: boolean;
  lessThanPreviousError: boolean;
}

export interface ITargetPrice {
  value: number;
  isActive: boolean;
  isError: boolean;
}

export interface IAmountToBuy {
  value: number;
  isActive: boolean;
  error: IAmountToBuyError | null;
}

export interface IAmountToBuyError {
  currentSum: number;
  decreaseBy: number;
}
