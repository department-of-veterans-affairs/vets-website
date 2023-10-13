import { expect } from 'chai';

import { getInitialData } from '../../helpers';

describe('getInitialData', () => {
  it('returns mockData if environment is localhost and Cypress is not running', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => true,
    };
    const result = getInitialData({ mockData, environment });
    expect(result).to.deep.equal(mockData);
  });

  it('returns undefined if environment is not localhost', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => false,
    };
    const result = getInitialData({ mockData, environment });
    expect(result).to.be.undefined;
  });

  it('returns undefined if Cypress is running', () => {
    const mockData = { foo: 'bar' };
    const environment = {
      isLocalhost: () => true,
    };
    window.Cypress = true;
    const result = getInitialData({ mockData, environment });
    expect(result).to.be.undefined;
    window.Cypress = undefined;
  });
});
