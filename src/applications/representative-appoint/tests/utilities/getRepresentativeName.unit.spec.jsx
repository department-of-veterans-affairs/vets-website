import { expect } from 'chai';
import { getRepresentativeName } from '../../utilities/helpers';

describe('getRepresentativeName', () => {
  it('should return null when there is no selected representative', () => {
    const mockFormData = {
      test: '123',
    };
    const result = getRepresentativeName(mockFormData);
    expect(result).to.be.null;
  });

  it('should return the name attribute for an organization', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'organization',
        attributes: {
          name: 'This is my name',
          fullName: 'This is my full name',
        },
      },
    };
    const result = getRepresentativeName(mockFormData);
    expect(result).to.equal('This is my name');
  });

  it('should return selectedAccreditedOrganizationName for an individual with many organizations', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: {
          name: 'This is my name',
          fullName: 'This is my full name',
          accreditedOrganizations: { data: [{ id: 1 }, { id: 2 }] },
        },
      },
      selectedAccreditedOrganizationName: 'This is my selected org name',
    };
    const result = getRepresentativeName(mockFormData);
    expect(result).to.equal('This is my selected org name');
  });

  it('should return fullName attribute for an individual with no organizations', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: {
          name: 'This is my name',
          fullName: 'This is my full name',
          accreditedOrganizations: { data: [] },
        },
      },
    };
    const result = getRepresentativeName(mockFormData);
    expect(result).to.equal('This is my full name');
  });
});
