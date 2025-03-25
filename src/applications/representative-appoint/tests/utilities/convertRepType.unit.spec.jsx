import { expect } from 'chai';
import { convertRepType } from '../../utilities/helpers';

describe('convertRepType', () => {
  context('when the input is organization', () => {
    it('should return "organization"', () => {
      const result = convertRepType('organization');
      expect(result).to.equal('Organization');
    });
  });

  context('when the input is representative', () => {
    it('should return "VSO"', () => {
      const result = convertRepType('representative');
      expect(result).to.equal('VSO');
    });
  });

  context('when the input is attorney', () => {
    it('should return "Attorney"', () => {
      const result = convertRepType('attorney');
      expect(result).to.equal('Attorney');
    });
  });

  context('when the input is claims_agent', () => {
    it('should return "Claims Agent"', () => {
      const result = convertRepType('claims_agent');
      expect(result).to.equal('Claims Agent');
    });
  });

  context('when the input is claim_agents', () => {
    it('should return "Claims Agent"', () => {
      const result = convertRepType('claim_agents');
      expect(result).to.equal('Claims Agent');
    });
  });

  context('when the input is veteran_service_officer', () => {
    it('should return "VSO"', () => {
      const result = convertRepType('veteran_service_officer');
      expect(result).to.equal('VSO');
    });
  });
});
