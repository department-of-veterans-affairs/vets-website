import { expect } from 'chai';

import { getFormNumberFromEntity } from '../../utilities/helpers';

describe('getFormNumberFromEntity', () => {
  it('should return "21-22" when entity type is organization', () => {
    const mockFormData = { type: 'organization' };
    const result = getFormNumberFromEntity(mockFormData);
    expect(result).to.equal('21-22');
  });

  it('should return "21-22a" when individual type is attorney', () => {
    const mockFormData = {
      type: 'individual',
      attributes: { individualType: 'attorney' },
    };
    const result = getFormNumberFromEntity(mockFormData);
    expect(result).to.equal('21-22a');
  });

  it('should return "21-22a" when individual type is claimsAgent', () => {
    const mockFormData = {
      type: 'individual',
      attributes: { individualType: 'claimsAgent' },
    };
    const result = getFormNumberFromEntity(mockFormData);
    expect(result).to.equal('21-22a');
  });

  it('should return "21-22" when individual type is representative', () => {
    const mockFormData = {
      type: 'individual',
      attributes: { individualType: 'representative' },
    };
    const result = getFormNumberFromEntity(mockFormData);
    expect(result).to.equal('21-22');
  });
});
