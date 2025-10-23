import mockDebt from './mockDebts.json';
import mockDebtVBMS from './mockDebtsVBMS.json';
import mockDebtError from './mockDebtsError.json';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const debtMockResponse = () => asyncReturn(mockDebt);
export const debtMockResponseVBMS = () => asyncReturn(mockDebtVBMS);
export const debtLettersFailure = () => asyncReturn(mockDebtError, 1000);
