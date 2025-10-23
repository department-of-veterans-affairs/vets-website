import { expect } from 'chai';

import { preparerIsVeteran } from '../../utilities/helpers';

describe('preparerIsVeteran', () => {
  it('should return true when the applicant is a veteran', () => {
    const mockFormData = {
      'view:applicantIsVeteran': 'Yes',
    };

    const result = preparerIsVeteran({ formData: mockFormData });
    expect(result).to.be.true;
  });

  it('should return false when the applicant is not a veteran', () => {
    const mockFormData = {
      'view:applicantIsVeteran': 'No',
    };

    const result = preparerIsVeteran({ formData: mockFormData });
    expect(result).to.be.false;
  });

  it('should return false when the applicant veteran field is undefined', () => {
    const mockFormData = {};

    const result = preparerIsVeteran({ formData: mockFormData });
    expect(result).to.be.false;
  });

  it('should return false when no formData is provided', () => {
    const result = preparerIsVeteran();
    expect(result).to.be.false;
  });
});
