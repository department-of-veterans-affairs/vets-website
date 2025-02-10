import { expect } from 'chai';

import { getOrgName } from '../../utilities/helpers';

describe('getOrgName', () => {
  it('should return the organization name when the representative is an organization', () => {
    const mockFormData = {
      inputSelectedRepresentative: {
        type: 'organization',
        attributes: { name: 'Disabled American Veterans' },
      },
    };

    const result = getOrgName(mockFormData);
    expect(result).to.equal('Disabled American Veterans');
  });

  it('should return null when the representative is an attorney or claims agent', () => {
    const mockFormData = {
      inputSelectedRepresentative: {
        type: 'individual',
        attributes: { individualType: 'attorney' },
      },
    };

    const result = getOrgName(mockFormData);
    expect(result).to.be.null;
  });

  it('should return the accredited organization name based on selected ID', () => {
    const mockFormData = {
      selectedAccreditedOrganizationId: '1',
      inputSelectedRepresentative: {
        attributes: {
          accreditedOrganizations: {
            data: [
              { id: '1', attributes: { name: 'Disabled American Veterans' } },
              { id: '3', attributes: { name: 'Fake Organization Name' } },
            ],
          },
        },
      },
    };

    const result = getOrgName(mockFormData);
    expect(result).to.equal('Disabled American Veterans');
  });

  it('should return the only accredited organization name when there is one organization', () => {
    const mockFormData = {
      inputSelectedRepresentative: {
        attributes: {
          accreditedOrganizations: {
            data: [
              { id: '1', attributes: { name: 'Disabled American Veterans' } },
            ],
          },
        },
      },
    };

    const result = getOrgName(mockFormData);
    expect(result).to.equal('Disabled American Veterans');
  });

  it('should return undefined when no matching accredited organization is found', () => {
    const mockFormData = {
      selectedAccreditedOrganizationId: '2', // No match
      inputSelectedRepresentative: {
        attributes: {
          accreditedOrganizations: {
            data: [
              { id: '1', attributes: { name: 'Disabled American Veterans' } },
              { id: '3', attributes: { name: 'Fake Organization Name' } },
            ],
          },
        },
      },
    };

    const result = getOrgName(mockFormData);
    expect(result).to.be.undefined;
  });
});
