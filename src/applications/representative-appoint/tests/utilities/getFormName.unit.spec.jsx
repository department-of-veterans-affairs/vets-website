import { expect } from 'chai';

import { getFormName } from '../../utilities/helpers';

describe('getFormName', () => {
  it('should return the form name "Appointment of Veterans Service Organization as Claimant\'s Representative" for an organization representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'organization',
      },
    };

    const result = getFormName(mockFormData);
    expect(result).to.equal(
      "Appointment of Veterans Service Organization as Claimant's Representative",
    );
  });

  it('should return the form name "Appointment of Veterans Service Organization as Claimant\'s Representative" when individualType is representative for an organization', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'organization',
        attributes: { individualType: 'representative' },
      },
    };

    const result = getFormName(mockFormData);
    expect(result).to.equal(
      "Appointment of Veterans Service Organization as Claimant's Representative",
    );
  });

  it('should return the form name "Appointment of Individual As Claimant\'s Representative" for an attorney representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'attorney' },
      },
    };

    const result = getFormName(mockFormData);
    expect(result).to.equal(
      "Appointment of Individual As Claimant's Representative",
    );
  });

  it('should return the form name "Appointment of Individual As Claimant\'s Representative" for a claims agent representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'claimsAgent' },
      },
    };

    const result = getFormName(mockFormData);
    expect(result).to.equal(
      "Appointment of Individual As Claimant's Representative",
    );
  });
});
