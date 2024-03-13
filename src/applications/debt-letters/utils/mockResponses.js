import mockDebt from '../tests/e2e/fixtures/mocks/debts.json';
import mockDebtVBMS from '../tests/e2e/fixtures/mocks/debtsVBMS.json';
import mockDebtError from '../tests/e2e/fixtures/mocks/debtsError.json';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const debtMockResponse = () => asyncReturn(mockDebt);
export const debtMockResponseVBMS = () => asyncReturn(mockDebtVBMS);
export const debtLettersFailure = () => asyncReturn(mockDebtError, 1000);
