import head from 'lodash/head';
import { isAfter } from 'date-fns';

export const calculateTotalDebts = debts => {
  return debts
    ? debts.reduce((acc, curr) => {
        return acc + curr.currentAr;
      }, 0)
    : 0;
};

export const getLatestDebt = debts => {
  return debts
    ? debts.reduce((acc, curr) => {
        const mostRecentHistory = head(curr.debtHistory);
        if (mostRecentHistory) {
          if (!acc) {
            return mostRecentHistory.date;
          }
          return isAfter(new Date(acc), new Date(mostRecentHistory.date))
            ? acc
            : mostRecentHistory.date;
        }
        return acc;
      }, null)
    : null;
};

export const calculateTotalBills = bills => {
  return bills
    ? bills.reduce((acc, currDebt) => {
        return acc + currDebt.pHAmtDue;
      }, 0)
    : 0;
};

export const getLatestBill = bills => {
  return bills
    ? bills.reduce((acc, currBill) => {
        if (currBill.pSStatementDateOutput) {
          if (!acc) {
            return currBill.pSStatementDateOutput;
          }
          return isAfter(
            new Date(acc),
            new Date(currBill.pSStatementDateOutput),
          )
            ? acc
            : currBill.pSStatementDateOutput;
        }
        return acc;
      }, null)
    : null;
};
