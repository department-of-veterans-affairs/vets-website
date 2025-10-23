import mockDebt from '../tests/e2e/fixtures/mocks/debts.json';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const debtMockResponse = () => asyncReturn(mockDebt);
