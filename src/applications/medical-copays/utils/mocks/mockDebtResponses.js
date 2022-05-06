import mockDebt from './debts.json';
import mockDebtVBMS from './debtsVBMS.json';
import mockDebtError from './debtsError.json';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const debtMockResponse = () => asyncReturn(mockDebt);
export const debtMockResponseVBMS = () => asyncReturn(mockDebtVBMS);
export const debtLettersFailure = () => asyncReturn(mockDebtError, 1000);
