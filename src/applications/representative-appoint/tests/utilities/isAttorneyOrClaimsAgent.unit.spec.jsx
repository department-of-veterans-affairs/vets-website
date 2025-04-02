import { expect } from 'chai';
import { formIs2122A } from '../../utilities/helpers';

describe('formIs2122A', () => {
  it('should return true when the selected rep has an individualType of attorney', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'attorney',
        },
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.be.true;
  });

  it('should return true when the selected rep has an individualType of claimsAgent', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'claimsAgent',
        },
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.be.true;
  });

  it('should return true when the selected rep has an individualType of claims_agent', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'claims_agent',
        },
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.be.true;
  });

  it('should return true when the selected rep has an individualType of claim_agents', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'claim_agents',
        },
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.be.true;
  });

  it('should return false when the selected rep has an other individualType', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'representative',
        },
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.not.be.ok;
  });

  it('should return false when the selected rep has no individualType', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {},
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.not.be.ok;
  });
});
