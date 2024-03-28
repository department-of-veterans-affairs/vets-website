import { expect } from 'chai';
import { transformCountryCode } from '../../utils/helpers';

describe('Burials helpers', () => {
  it('should transform USA to US', () => {
    const usResult = transformCountryCode('USA');
    const mexResult = transformCountryCode('MEX');
    const canResult = transformCountryCode('CAN');
    const otherResult = transformCountryCode('TEST');

    expect(usResult).to.eq('US');
    expect(mexResult).to.eq('MX');
    expect(canResult).to.eq('CA');
    expect(otherResult).to.eq('TEST');
  });
});
