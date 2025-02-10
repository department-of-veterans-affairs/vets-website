import { expect } from 'chai';
import { formIs2122A } from '../../utilities/helpers';

describe('formIs2122A', () => {
  it('should return true when the selected rep has an individualType of attorney', () => {
    const mockFormData = {
      inputSelectedRepresentative: {
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
      inputSelectedRepresentative: {
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
      inputSelectedRepresentative: {
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
      inputSelectedRepresentative: {
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
      inputSelectedRepresentative: {
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
      inputSelectedRepresentative: {
        attributes: {},
      },
    };
    const result = formIs2122A(mockFormData);
    expect(result).to.not.be.ok;
  });
});
