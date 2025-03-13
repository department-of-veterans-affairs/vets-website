import { expect } from 'chai';
import sinon from 'sinon';
import {
  aboutYourselfGeneralUISchema,
  personalInformationFormSchemas,
  personalInformationUiSchemas,
  validateSSandSNGroup,
} from '../../../config/schema-helpers/personalInformationHelper';

describe('personalInformationHelper', () => {
  describe('validateSSandSNGroup', () => {
    let errors;
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      errors = {
        addError: sandbox.spy(),
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should not add error when SSN is provided', () => {
      const values = { ssn: '123456789' };
      const formData = { whoIsYourQuestionAbout: 'Myself' };
      validateSSandSNGroup(errors, values, formData);
      expect(errors.addError.called).to.be.false;
    });

    it('should not add error when service number is provided', () => {
      const values = { serviceNumber: '12345678' };
      const formData = { whoIsYourQuestionAbout: 'Myself' };
      validateSSandSNGroup(errors, values, formData);
      expect(errors.addError.called).to.be.false;
    });

    it('should add error when neither SSN nor service number is provided', () => {
      const values = {};
      const formData = { whoIsYourQuestionAbout: 'Myself' };
      validateSSandSNGroup(errors, values, formData);
      expect(
        errors.addError.calledWith(
          'Please enter your Social Security number or Service number',
        ),
      ).to.be.true;
    });

    it('should not add error for general questions', () => {
      const values = {};
      const formData = { whoIsYourQuestionAbout: "It's a general question" };
      validateSSandSNGroup(errors, values, formData);
      expect(errors.addError.called).to.be.false;
    });

    it('should not add error for family members', () => {
      const values = {};
      const formData = {
        whoIsYourQuestionAbout: 'Someone else',
        relationshipToVeteran: "I'm a family member of a Veteran",
      };
      validateSSandSNGroup(errors, values, formData);
      expect(errors.addError.called).to.be.false;
    });

    it('should not add error for work-related connections', () => {
      const values = {};
      const formData = {
        whoIsYourQuestionAbout: 'Someone else',
        relationshipToVeteran:
          "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
      };
      validateSSandSNGroup(errors, values, formData);
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('schema validations', () => {
    it('should validate first name pattern', () => {
      const { first } = personalInformationFormSchemas;
      expect(first.pattern).to.equal('^[A-Za-z]+$');
      expect(first.minLength).to.equal(1);
      expect(first.maxLength).to.equal(25);
    });

    it('should validate branch of service schema', () => {
      const { branchOfService } = personalInformationFormSchemas;
      expect(branchOfService.type).to.equal('string');
    });

    it('should validate social or service number schema', () => {
      const { socialOrServiceNum } = personalInformationFormSchemas;
      expect(socialOrServiceNum.type).to.equal('object');
      expect(socialOrServiceNum.properties).to.have.keys([
        'ssn',
        'serviceNumber',
      ]);
    });

    it('should validate UI schema required fields', () => {
      const { first, last } = personalInformationUiSchemas;
      expect(first['ui:required']()).to.be.true;
      expect(last['ui:required']()).to.be.true;
    });

    it('should validate about yourself general UI schema', () => {
      const { first, middle, last, suffix } = aboutYourselfGeneralUISchema;
      expect(first['ui:options'].uswds).to.be.true;
      expect(middle['ui:options'].uswds).to.be.true;
      expect(last['ui:options'].uswds).to.be.true;
      expect(suffix['ui:options'].uswds).to.be.true;
    });
  });
});
