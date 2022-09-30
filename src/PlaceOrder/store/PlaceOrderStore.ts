import { observable, computed, action } from 'mobx';
import { v4 as uuid } from 'uuid';

import { OrderSide, Profit, IProfitItem, ITargetPrice, IProfit, IAmountToBuy } from '../model';

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

export class PlaceOrderStore {
  @observable activeOrderSide: OrderSide = 'buy';
  @observable price: number = 0;
  @observable amount: number = 0;
  @observable private takeProfitList: IProfitItem[] = [];

  @computed get total(): number {
    return this.price * this.amount;
  }

  @computed get profitList(): IProfitItem[] {
    return this.takeProfitList.map((item) => {
      return {
        ...item,
        target: {
          ...item.target,
          value: this.price + this.price * (item.profit.value / 100),
        },
        price: this.price,
      };
    });
  }

  @computed get projectedProfit(): number {
    return this.activeOrderSide === 'buy'
      ? this.takeProfitList.reduce((acc, curr) => {
          const expectedProfit = (curr.amountToBuy.value / 100) * (curr.target.value - curr.price);
          return acc + expectedProfit;
        }, 0)
      : this.takeProfitList.reduce((acc, curr) => {
          const expectedProfit = (curr.amountToBuy.value / 100) * (curr.price - curr.target.value);
          return acc + expectedProfit;
        }, 0);
  }

  @action.bound
  public setOrderSide(side: OrderSide) {
    this.activeOrderSide = side;
  }

  @action.bound
  public setPrice(price: number) {
    this.price = price;
  }

  @action.bound
  public setAmount(amount: number) {
    this.amount = amount;
  }

  @action.bound
  public setTotal(total: number) {
    this.amount = this.price > 0 ? total / this.price : 0;
  }

  @action.bound
  public initTakeProfitList() {
    this.takeProfitList.push(new TakeProfitItem(2, this.price, 100));
  }

  @action.bound
  public updateTakeProfitItem(id: string, item: IProfitItem) {
    const itemForUpdateIdx = this.takeProfitList.findIndex((item) => item.id === id);
    this.takeProfitList.splice(itemForUpdateIdx, 1, item);
  }

  @action.bound
  public clearTakeProfitList() {
    this.takeProfitList = [];
  }

  @action.bound
  public addTakeProfitItem() {
    if (!this.takeProfitList.length) {
      this.initTakeProfitList();
      return;
    }
    const latestItem = this.takeProfitList[this.takeProfitList.length - 1];
    const newItem = new TakeProfitItem(latestItem.profit.value + 2, this.price, 20);
    const newList = this.adjustAmountToBuy([...this.takeProfitList, newItem]);

    this.takeProfitList = newList;
  }

  @action.bound
  public removeTakeProfitItem(id: string) {
    this.resetMaximumProfitSumError();
    this.takeProfitList = this.takeProfitList.filter((item) => item.id !== id);
  }

  @action.bound
  public checkTakeProfitListOnErrors() {
    this.resetMaximumProfitSumError();

    const checkedList = this.profitList.map((item, index, self) => {
      if (item.target.value === 0) {
        item.target.isError = true;
      }
      if (index > 0 && item.profit.value < self[index - 1].profit.value) {
        item.profit.lessThanPreviousError = true;
      }
      if (item.profit.value < 0.01) {
        item.profit.lessThanMinValueError = true;
      }
      return item;
    });

    const over = this.profitList.reduce(
      (acc, curr) => {
        const tmp = {
          profitFieldsSum: acc.profitFieldsSum + curr.profit.value,
          amountToBuyFieldsSum: acc.amountToBuyFieldsSum + curr.amountToBuy.value,
        };
        acc = tmp;
        return acc;
      },
      { profitFieldsSum: 0, amountToBuyFieldsSum: 0 }
    );

    if (over.profitFieldsSum > 500) {
      checkedList[checkedList.length - 1].profit.overLimitError = true;
    }

    if (over.amountToBuyFieldsSum > 100) {
      checkedList[checkedList.length - 1].amountToBuy.error = {
        currentSum: over.amountToBuyFieldsSum,
        decreaseBy: over.amountToBuyFieldsSum - 100,
      };
    }

    this.takeProfitList = checkedList;
  }

  @action.bound
  public outputTakeProfitList(): Profit[] | null {
    this.checkTakeProfitListOnErrors();
    const hasErrors = this.profitList.some((item) => {
      return (
        item.profit.lessThanMinValueError ||
        item.profit.lessThanPreviousError ||
        item.profit.overLimitError ||
        item.target.isError ||
        item.amountToBuy.error !== null
      );
    });
    return hasErrors
      ? null
      : this.profitList.map((item) => {
          return {
            profit: item.profit.value,
            targetPrice: item.target.value,
            amountToBuy: item.amountToBuy.value,
          };
        });
  }

  private adjustAmountToBuy(list: IProfitItem[]): IProfitItem[] {
    const adjustedList: IProfitItem[] = list;

    const amountToBuySum = list.reduce((acc, curr) => {
      return acc + curr.amountToBuy.value;
    }, 0);

    if (amountToBuySum > 100) {
      const copyList = [...list];
      copyList.sort((a, b) => {
        return b.amountToBuy.value - a.amountToBuy.value;
      });
      const itemWithMaxValue = copyList[0];
      const excess = amountToBuySum - 100;
      const newValue = itemWithMaxValue.amountToBuy.value - excess;

      const updatedList = list.map((item) => {
        if (item.id === itemWithMaxValue.id) {
          item.amountToBuy.value = newValue;
        }
        return item;
      });

      return updatedList;
    }

    return adjustedList;
  }

  private resetMaximumProfitSumError(): void {
    this.takeProfitList = this.takeProfitList.map((item) => {
      item.profit.overLimitError = false;
      return item;
    });
  }
}
