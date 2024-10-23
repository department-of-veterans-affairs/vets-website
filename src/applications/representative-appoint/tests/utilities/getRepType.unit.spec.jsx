import { expect } from 'chai';

import { getRepType } from '../../utilities/helpers';

describe('getRepType', () => {
  it('should return "Organization" when entity type is organization', () => {
    const mockFormData = {
      'view:selectedRepresentative': { type: 'organization' },
    };
    const result = getRepType(mockFormData);
    expect(result).to.equal('Organization');
  });

  it('should return "Attorney" when individual type is attorney', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'attorney' },
      },
    };
    const result = getRepType(mockFormData);
    expect(result).to.equal('Attorney');
  });

  it('should return "Claims Agent" when individual type is claimsAgent', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'claimsAgent' },
      },
    };
    const result = getRepType(mockFormData);
    expect(result).to.equal('Claims Agent');
  });

  it('should return "VSO Representative" when individual type is representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'representative' },
      },
    };
    const result = getRepType(mockFormData);
    expect(result).to.equal('VSO Representative');
  });
});
