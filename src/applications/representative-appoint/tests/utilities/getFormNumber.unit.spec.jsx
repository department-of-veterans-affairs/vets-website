import { expect } from 'chai';

import { getFormNumber } from '../../utilities/helpers';

describe('getFormNumber', () => {
  it('should return "21-22" for an organization', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'organization',
      },
    };

    const result = getFormNumber(mockFormData);
    expect(result).to.equal('21-22');
  });

  it('should return "21-22" for just an organization representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'organization',
        attributes: { individualType: 'representative' },
      },
    };

    const result = getFormNumber(mockFormData);
    expect(result).to.equal('21-22');
  });

  it('should return "21-22" for an individual representative', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'representative' },
      },
    };

    const result = getFormNumber(mockFormData);
    expect(result).to.equal('21-22');
  });

  it('should return "21-22a" for an attorney or claims agent', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        type: 'individual',
        attributes: { individualType: 'attorney' },
      },
    };

    const result = getFormNumber(mockFormData);
    expect(result).to.equal('21-22a');
  });
});
