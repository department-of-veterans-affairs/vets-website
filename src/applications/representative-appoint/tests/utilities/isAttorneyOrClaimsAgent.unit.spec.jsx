import { expect } from 'chai';
import { isAttorneyOrClaimsAgent } from '../../utilities/helpers';

describe('isAttorneyOrClaimsAgent', () => {
  it('should return true when the selected rep has an individualType of attorney', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {
          individualType: 'attorney',
        },
      },
    };
    const result = isAttorneyOrClaimsAgent(mockFormData);
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
    const result = isAttorneyOrClaimsAgent(mockFormData);
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
    const result = isAttorneyOrClaimsAgent(mockFormData);
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
    const result = isAttorneyOrClaimsAgent(mockFormData);
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
    const result = isAttorneyOrClaimsAgent(mockFormData);
    expect(result).to.be.false;
  });

  it('should return false when the selected rep has no individualType', () => {
    const mockFormData = {
      'view:selectedRepresentative': {
        attributes: {},
      },
    };
    const result = isAttorneyOrClaimsAgent(mockFormData);
    expect(result).to.be.false;
  });
});
