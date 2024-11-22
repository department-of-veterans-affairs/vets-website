import { expect } from 'chai';
import { isVSORepresentative } from '../../utilities/helpers';

describe('isVSORepresentative', () => {
  it('should return true when the selected rep has at least one organization', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: {
          accreditedOrganizations: { data: [{ id: 1 }, { id: 2 }] },
        },
      },
    };
    const result = isVSORepresentative(mockFormData);
    expect(result).to.be.true;
  });

  it('should return false when the selected rep has no organizations', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: {
          accreditedOrganizations: { data: [] },
        },
      },
    };
    const result = isVSORepresentative(mockFormData);
    expect(result).to.be.false;
  });
});
