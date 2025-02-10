import { expect } from 'chai';
import prefill from '../fixtures/data/prefill.json';
import prefillTransformer from '../../config/prefillTransformer';

describe('prefillTransformer', () => {
  context('when the applicant is the Veteran', () => {
    it('should set the Veteran attributes with prefill information', () => {
      const data = { ...prefill, 'view:applicantIsVeteran': 'Yes' };

      const result = prefillTransformer(data);

      expect(result.inputVeteranFullName).to.eql({
        first: 'Greg',
        last: 'Anderson',
        middle: 'A',
      });
      expect(result.inputVeteranDOB).to.eql('1933-04-05');
      expect(result.inputVeteranSSN).to.eql('796121200');
      expect(result.inputVeteranHomeAddress).to.eql({
        street: '123 avenue du Maine',
        city: 'Paris',
        state: 'Paris',
        country: 'FRA',
        postalCode: '75014',
      });
      expect(result.inputVeteranEmail).to.eql('test2@test1.net');
      expect(result.inputVeteranPrimaryPhone).to.eql('4445551212');
      expect(result.inputVeteranServiceBranch).to.eql('Army');
    });

    it('should reset the applicant attributes', () => {
      const data = {
        ...prefill,
        'view:applicantIsVeteran': 'Yes',
        inputNonVeteranClaimantName: 'test',
        inputNonVeteranClaimantDOB: 'test',
        inputNonVeteranClaimantEmail: 'test',
        inputNonVeteranClaimantPhone: 'test',
        inputNonVeteranClaimantHomeAddress: {
          city: 'test',
          country: 'test',
          postalCode: 'test',
          state: 'test',
          street: 'test',
        },
      };

      const result = prefillTransformer(data);

      expect(result.inputNonVeteranClaimantName).to.be.undefined;
      expect(result.inputNonVeteranClaimantDOB).to.be.undefined;
      expect(result.inputNonVeteranClaimantEmail).to.be.undefined;
      expect(result.inputNonVeteranClaimantPhone).to.be.undefined;
      expect(result.inputNonVeteranClaimantHomeAddress).to.eql({
        city: undefined,
        country: undefined,
        postalCode: undefined,
        state: undefined,
        street: undefined,
      });
    });
  });

  context('when the applicant is not the Veteran', () => {
    it('should set the applicant attributes with prefill information', () => {
      const data = { ...prefill, 'view:applicantIsVeteran': 'No' };

      const result = prefillTransformer(data);

      expect(result.inputNonVeteranClaimantName).to.eql({
        first: 'Greg',
        last: 'Anderson',
        middle: 'A',
      });
      expect(result.inputNonVeteranClaimantDOB).to.eql('1933-04-05');
      expect(result.inputNonVeteranClaimantHomeAddress).to.eql({
        street: '123 avenue du Maine',
        city: 'Paris',
        state: 'Paris',
        country: 'FRA',
        postalCode: '75014',
      });
      expect(result.inputNonVeteranClaimantEmail).to.eql('test2@test1.net');
      expect(result.inputNonVeteranClaimantPhone).to.eql('4445551212');
    });

    it('should reset the Veteran attributes', () => {
      const data = {
        ...prefill,
        'view:applicantIsVeteran': 'No',
        inputVeteranFullName: 'test',
        inputVeteranDOB: 'test',
        inputVeteranEmail: 'test',
        inputVeteranPrimaryPhone: 'test',
        inputVeteranHomeAddress: {
          city: 'test',
          country: 'test',
          postalCode: 'test',
          state: 'test',
          street: 'test',
        },
        inputVeteranServiceBranch: 'test',
        inputVeteranSSN: 'test',
      };

      const result = prefillTransformer(data);

      expect(result.inputVeteranFullName).to.be.undefined;
      expect(result.inputVeteranDOB).to.be.undefined;
      expect(result.inputVeteranEmail).to.be.undefined;
      expect(result.inputVeteranPrimaryPhone).to.be.undefined;
      expect(result.inputVeteranHomeAddress).to.eql({
        city: undefined,
        country: undefined,
        postalCode: undefined,
        state: undefined,
        street: undefined,
      });
      expect(result.inputVeteranServiceBranch).to.be.undefined;
      expect(result.inputVeteranSSN).to.be.undefined;
    });
  });

  context('when the user does not have an ICN', () => {
    it('sets userIsDigitalSubmitEligible to false', () => {
      const data = {
        ...prefill,
        identityValidation: { hasIcn: false, hasParticipantId: true },
      };

      const result = prefillTransformer(data);

      expect(result.userIsDigitalSubmitEligible).to.be.false;
    });
  });

  context('when the user does not have a participant id', () => {
    it('sets userIsDigitalSubmitEligible to false', () => {
      const data = {
        ...prefill,
        identityValidation: { hasIcn: true, hasParticipantId: false },
      };

      const result = prefillTransformer(data);

      expect(result.userIsDigitalSubmitEligible).to.be.false;
    });
  });

  context('when the user has an ICN and a participant id', () => {
    it('sets userIsDigitalSubmitEligible to true', () => {
      const data = { ...prefill };

      const result = prefillTransformer(data);

      expect(result.userIsDigitalSubmitEligible).to.be.true;
    });
  });
});
