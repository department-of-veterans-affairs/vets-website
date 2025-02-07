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
      expect(result.veteranEmail).to.eql('test2@test1.net');
      expect(result.primaryPhone).to.eql('4445551212');
      expect(result['Branch of Service']).to.eql('Army');
    });

    it('should reset the applicant attributes', () => {
      const data = {
        ...prefill,
        'view:applicantIsVeteran': 'Yes',
        applicantName: 'test',
        applicantDOB: 'test',
        applicantEmail: 'test',
        applicantPhone: 'test',
        homeAddress: {
          city: 'test',
          country: 'test',
          postalCode: 'test',
          state: 'test',
          street: 'test',
        },
      };

      const result = prefillTransformer(data);

      expect(result.applicantName).to.be.undefined;
      expect(result.applicantDOB).to.be.undefined;
      expect(result.applicantEmail).to.be.undefined;
      expect(result.applicantPhone).to.be.undefined;
      expect(result.homeAddress).to.eql({
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

      expect(result.applicantName).to.eql({
        first: 'Greg',
        last: 'Anderson',
        middle: 'A',
      });
      expect(result.applicantDOB).to.eql('1933-04-05');
      expect(result.homeAddress).to.eql({
        street: '123 avenue du Maine',
        city: 'Paris',
        state: 'Paris',
        country: 'FRA',
        postalCode: '75014',
      });
      expect(result.applicantEmail).to.eql('test2@test1.net');
      expect(result.applicantPhone).to.eql('4445551212');
    });

    it('should reset the Veteran attributes', () => {
      const data = {
        ...prefill,
        'view:applicantIsVeteran': 'No',
        inputVeteranFullName: 'test',
        inputVeteranDOB: 'test',
        veteranEmail: 'test',
        primaryPhone: 'test',
        inputVeteranHomeAddress: {
          city: 'test',
          country: 'test',
          postalCode: 'test',
          state: 'test',
          street: 'test',
        },
        'Branch of Service': 'test',
        inputVeteranSSN: 'test',
      };

      const result = prefillTransformer(data);

      expect(result.inputVeteranFullName).to.be.undefined;
      expect(result.inputVeteranDOB).to.be.undefined;
      expect(result.veteranEmail).to.be.undefined;
      expect(result.primaryPhone).to.be.undefined;
      expect(result.inputVeteranHomeAddress).to.eql({
        city: undefined,
        country: undefined,
        postalCode: undefined,
        state: undefined,
        street: undefined,
      });
      expect(result['Branch of Service']).to.be.undefined;
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
