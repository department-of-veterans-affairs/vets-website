import { expect } from 'chai';
import { formatServiceName } from '../../utils/formatServiceName';

describe('formatServiceName', () => {
  it('Should convert camel case to sentence case', () => {
    const serviceTest = formatServiceName('Primary Care');
    expect(serviceTest).to.equal('Primary care');
  });
});
