import { expect } from 'chai';
import { getApplicantName } from '../../utilities/helpers';

describe('getApplicantName', () => {
  context('when the applicant is the Veteran', () => {
    it('should return the Veteran name formatted correctly', () => {
      const mockFormData = {
        'view:applicantIsVeteran': 'Yes',
        veteranFullName: {
          first: 'Bob',
          middle: 'A',
          last: 'Smith',
          suffix: 'Sr.',
        },
      };
      const result = getApplicantName(mockFormData);
      expect(result).to.equal('Bob A Smith Sr.');
    });
  });

  context('when the applicant is not the Veteran', () => {
    it('should return the non-Veteran applicant name formatted correctly', () => {
      const mockFormData = {
        'view:applicantIsVeteran': 'No',
        applicantName: {
          first: 'Bob',
          middle: 'B',
          last: 'Smith',
          suffix: 'Jr.',
        },
      };
      const result = getApplicantName(mockFormData);
      expect(result).to.equal('Bob B Smith Jr.');
    });
  });
});
