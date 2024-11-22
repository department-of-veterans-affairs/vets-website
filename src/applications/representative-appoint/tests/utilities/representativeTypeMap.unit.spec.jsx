import { expect } from 'chai';
import { representativeTypeMap } from '../../utilities/helpers';

describe('representativeTypeMap', () => {
  it('should return "attorney" when given "Attorney"', () => {
    const result = representativeTypeMap.Attorney;
    expect(result).to.equal('attorney');
  });

  it('should return "claims agent" when given "Claims Agent"', () => {
    const result = representativeTypeMap['Claims Agent'];
    expect(result).to.equal('claims agent');
  });

  it('should return "Veterans Service Organization (VSO)" when given "Veterans Service Organization (VSO)"', () => {
    const result = representativeTypeMap['Veterans Service Organization (VSO)'];
    expect(result).to.equal('Veterans Service Organization (VSO)');
  });
});
