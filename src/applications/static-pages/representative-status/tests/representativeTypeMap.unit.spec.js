import { expect } from 'chai';
import { representativeTypeMap } from '../utilities/representativeTypeMap';

describe('rep type map', () => {
  context('when the input is organization', () => {
    it('should return "Veteran Service Organization (VSO)"', () => {
      const result = representativeTypeMap('organization');
      expect(result).to.equal('Veteran Service Organization (VSO)');
    });
  });

  context('when the input is representative', () => {
    it('should return "Veteran Service Organization (VSO)"', () => {
      const result = representativeTypeMap('representative');
      expect(result).to.equal('Veteran Service Organization (VSO)');
    });
  });

  context('when the input is veteran_service_officer', () => {
    it('should return Veteran Service Organization (VSO)"', () => {
      const result = representativeTypeMap('veteran_service_officer');
      expect(result).to.equal('Veteran Service Organization (VSO)');
    });
  });

  context('when the input is attorney', () => {
    it('should return "accredited attorney"', () => {
      const result = representativeTypeMap('attorney');
      expect(result).to.equal('accredited attorney');
    });
  });

  context('when the input is claims_agent', () => {
    it('should return "accredited claims agent"', () => {
      const result = representativeTypeMap('claims_agent');
      expect(result).to.equal('accredited claims agent');
    });
  });

  context('when the input is claim_agents', () => {
    it('should return "accredited claims agent"', () => {
      const result = representativeTypeMap('claim_agents');
      expect(result).to.equal('accredited claims agent');
    });
  });
});
