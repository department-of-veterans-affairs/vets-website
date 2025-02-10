import { expect } from 'chai';
import { getinputNonVeteranClaimantName } from '../../utilities/helpers';

describe('getinputNonVeteranClaimantName', () => {
  context('when the applicant is the Veteran', () => {
    it('should return the Veteran name formatted correctly', () => {
      const mockFormData = {
        'view:applicantIsVeteran': 'Yes',
        inputVeteranFullName: {
          first: 'Bob',
          middle: 'A',
          last: 'Smith',
          suffix: 'Sr.',
        },
      };
      const result = getinputNonVeteranClaimantName(mockFormData);
      expect(result).to.equal('Bob A Smith Sr.');
    });
  });

  context('when the applicant is not the Veteran', () => {
    it('should return the non-Veteran applicant name formatted correctly', () => {
      const mockFormData = {
        'view:applicantIsVeteran': 'No',
        inputNonVeteranClaimantName: {
          first: 'Bob',
          middle: 'B',
          last: 'Smith',
          suffix: 'Jr.',
        },
      };
      const result = getinputNonVeteranClaimantName(mockFormData);
      expect(result).to.equal('Bob B Smith Jr.');
    });
  });
});
