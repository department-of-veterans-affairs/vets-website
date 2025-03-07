import { expect } from 'chai';

import { userIsDigitalSubmitEligible } from '../../utilities/helpers';

describe('userIsDigitalSubmitEligible', () => {
  context('the user is not a Veteran', () => {
    it('returns false', () => {
      const formData = {
        'view:applicantIsVeteran': 'No',
        'view:v2IsEnabled': true,
        identityValidation: {
          hasIcn: true,
          hasParticipantId: true,
        },
      };

      const result = userIsDigitalSubmitEligible(formData);
      expect(result).to.be.false;
    });
  });

  context('the user is does not have an ICN', () => {
    it('returns false', () => {
      const formData = {
        'view:applicantIsVeteran': 'Yes',
        'view:v2IsEnabled': true,
        identityValidation: {
          hasIcn: false,
          hasParticipantId: true,
        },
      };

      const result = userIsDigitalSubmitEligible(formData);
      expect(result).to.be.false;
    });
  });

  context('the user is does not have a participant id', () => {
    it('returns false', () => {
      const formData = {
        'view:applicantIsVeteran': 'Yes',
        'view:v2IsEnabled': true,
        identityValidation: {
          hasIcn: true,
          hasParticipantId: false,
        },
      };

      const result = userIsDigitalSubmitEligible(formData);
      expect(result).to.be.false;
    });
  });

  context('v2 is not enabled', () => {
    it('returns false', () => {
      const formData = {
        'view:applicantIsVeteran': 'Yes',
        'view:v2IsEnabled': false,
        identityValidation: {
          hasIcn: true,
          hasParticipantId: true,
        },
      };

      const result = userIsDigitalSubmitEligible(formData);
      expect(result).to.be.false;
    });
  });

  context('all criteria are met', () => {
    it('returns true', () => {
      const formData = {
        'view:applicantIsVeteran': 'Yes',
        'view:v2IsEnabled': true,
        identityValidation: {
          hasIcn: true,
          hasParticipantId: true,
        },
      };

      const result = userIsDigitalSubmitEligible(formData);
      expect(result).to.be.true;
    });
  });
});
