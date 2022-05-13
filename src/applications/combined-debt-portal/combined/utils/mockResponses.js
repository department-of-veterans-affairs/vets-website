import mockDebt from './mock-users/mockDebts.json';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const debtMockResponse = () => asyncReturn(mockDebt);
