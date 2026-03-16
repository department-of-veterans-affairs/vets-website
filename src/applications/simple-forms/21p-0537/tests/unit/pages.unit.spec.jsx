import { expect } from 'chai';
import sinon from 'sinon';

import marriageInfo from '../../pages/marriageInfo';
import phoneAndEmail from '../../pages/phoneAndEmail';
import remarriageQuestion from '../../pages/remarriageQuestion';
import spouseVeteranId from '../../pages/spouseVeteranId';
import spouseVeteranStatus from '../../pages/spouseVeteranStatus';
import terminationDetails from '../../pages/terminationDetails';
import terminationStatus from '../../pages/terminationStatus';
import {
  marriageDateValidation,
  terminationDateValidation,
} from '../../helpers';

describe('21P-0537 page configurations', () => {
  describe('marriageInfo', () => {
    it('exports uiSchema and schema', () => {
      expect(marriageInfo).to.have.property('uiSchema');
      expect(marriageInfo).to.have.property('schema');
    });

    it('has required function for spouse first name', () => {
      const firstNameRequired =
        marriageInfo.uiSchema.remarriage.spouseName.first['ui:required'];
      expect(firstNameRequired).to.be.a('function');
      expect(firstNameRequired()).to.be.true;
    });

    it('has required function for spouse last name', () => {
      const lastNameRequired =
        marriageInfo.uiSchema.remarriage.spouseName.last['ui:required'];
      expect(lastNameRequired).to.be.a('function');
      expect(lastNameRequired()).to.be.true;
    });

    it('has required function for marriage date', () => {
      const dateRequired =
        marriageInfo.uiSchema.remarriage.dateOfMarriage['ui:required'];
      expect(dateRequired).to.be.a('function');
      expect(dateRequired()).to.be.true;
    });

    it('has required function for spouse date of birth', () => {
      const dobRequired =
        marriageInfo.uiSchema.remarriage.spouseDateOfBirth['ui:required'];
      expect(dobRequired).to.be.a('function');
      expect(dobRequired()).to.be.true;
    });

    it('has required function for age at marriage', () => {
      const ageRequired =
        marriageInfo.uiSchema.remarriage.ageAtMarriage['ui:required'];
      expect(ageRequired).to.be.a('function');
      expect(ageRequired()).to.be.true;
    });

    it('sets age max to 130', () => {
      const { max } = marriageInfo.uiSchema.remarriage.ageAtMarriage[
        'ui:options'
      ];
      expect(max).to.equal(130);
    });

    it('has page-level ui:validations with marriageDateValidation', () => {
      expect(marriageInfo.uiSchema['ui:validations']).to.be.an('array');
      expect(marriageInfo.uiSchema['ui:validations']).to.include(
        marriageDateValidation,
      );
    });
  });

  describe('phoneAndEmail', () => {
    it('exports uiSchema and schema', () => {
      expect(phoneAndEmail).to.have.property('uiSchema');
      expect(phoneAndEmail).to.have.property('schema');
    });

    it('has primaryPhone field', () => {
      expect(phoneAndEmail.uiSchema).to.have.property('primaryPhone');
      expect(phoneAndEmail.schema.properties).to.have.property('primaryPhone');
    });

    it('has secondaryPhone field', () => {
      expect(phoneAndEmail.uiSchema).to.have.property('secondaryPhone');
      expect(phoneAndEmail.schema.properties).to.have.property(
        'secondaryPhone',
      );
    });

    it('has emailAddress field', () => {
      expect(phoneAndEmail.uiSchema).to.have.property('emailAddress');
      expect(phoneAndEmail.schema.properties).to.have.property('emailAddress');
    });

    it('requires primaryPhone and emailAddress', () => {
      expect(phoneAndEmail.schema.required).to.include('primaryPhone');
      expect(phoneAndEmail.schema.required).to.include('emailAddress');
    });
  });

  describe('remarriageQuestion', () => {
    it('exports uiSchema and schema', () => {
      expect(remarriageQuestion).to.have.property('uiSchema');
      expect(remarriageQuestion).to.have.property('schema');
    });

    it('has hasRemarried field', () => {
      expect(remarriageQuestion.uiSchema).to.have.property('hasRemarried');
      expect(remarriageQuestion.schema.properties).to.have.property(
        'hasRemarried',
      );
    });

    it('hasRemarried is required', () => {
      expect(remarriageQuestion.schema.required).to.include('hasRemarried');
    });
  });

  describe('spouseVeteranId', () => {
    it('exports uiSchema and schema', () => {
      expect(spouseVeteranId).to.have.property('uiSchema');
      expect(spouseVeteranId).to.have.property('schema');
    });

    it('has spouse veteran ID field required in schema', () => {
      expect(spouseVeteranId.schema.properties.remarriage.required).to.include(
        'spouseVeteranId',
      );
    });
  });

  describe('spouseVeteranStatus', () => {
    it('exports uiSchema and schema', () => {
      expect(spouseVeteranStatus).to.have.property('uiSchema');
      expect(spouseVeteranStatus).to.have.property('schema');
    });

    it('has labels object', () => {
      const {
        labels,
      } = spouseVeteranStatus.uiSchema.remarriage.spouseIsVeteran['ui:options'];
      expect(labels).to.exist;
      expect(labels).to.have.property('Y');
      expect(labels).to.have.property('N');
    });
  });

  describe('terminationDetails', () => {
    it('exports uiSchema and schema', () => {
      expect(terminationDetails).to.have.property('uiSchema');
      expect(terminationDetails).to.have.property('schema');
    });

    it('has required function for termination date', () => {
      const dateRequired =
        terminationDetails.uiSchema.remarriage.terminationDate['ui:required'];
      expect(dateRequired).to.be.a('function');
      expect(dateRequired()).to.be.true;
    });

    it('has required function for termination reason', () => {
      const reasonRequired =
        terminationDetails.uiSchema.remarriage.terminationReason['ui:required'];
      expect(reasonRequired).to.be.a('function');
      expect(reasonRequired()).to.be.true;
    });

    it('has page-level ui:validations with terminationDateValidation', () => {
      expect(terminationDetails.uiSchema['ui:validations']).to.be.an('array');
      expect(terminationDetails.uiSchema['ui:validations']).to.include(
        terminationDateValidation,
      );
    });
  });

  describe('marriageDateValidation', () => {
    const makeErrors = () => ({
      remarriage: {
        dateOfMarriage: { addError: sinon.spy() },
        ageAtMarriage: { addError: sinon.spy() },
      },
    });

    it('adds error when marriage date is before spouse DOB', () => {
      const errors = makeErrors();
      const fields = {
        remarriage: {
          dateOfMarriage: '1990-01-01',
          spouseDateOfBirth: '1995-06-15',
        },
      };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.dateOfMarriage.addError.calledOnce).to.be.true;
    });

    it('does not add error when marriage date equals spouse DOB', () => {
      const errors = makeErrors();
      const fields = {
        remarriage: {
          dateOfMarriage: '1995-06-15',
          spouseDateOfBirth: '1995-06-15',
        },
      };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.dateOfMarriage.addError.called).to.be.false;
    });

    it('does not add error when marriage date is after spouse DOB', () => {
      const errors = makeErrors();
      const fields = {
        remarriage: {
          dateOfMarriage: '2020-03-10',
          spouseDateOfBirth: '1995-06-15',
        },
      };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.dateOfMarriage.addError.called).to.be.false;
    });

    it('does not add error when dates are missing', () => {
      const errors = makeErrors();
      marriageDateValidation(errors, { remarriage: {} });
      expect(errors.remarriage.dateOfMarriage.addError.called).to.be.false;
    });

    it('adds error when age exceeds 130', () => {
      const errors = makeErrors();
      const fields = { remarriage: { ageAtMarriage: '131' } };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.ageAtMarriage.addError.calledOnce).to.be.true;
    });

    it('adds error when age is negative', () => {
      const errors = makeErrors();
      const fields = { remarriage: { ageAtMarriage: '-1' } };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.ageAtMarriage.addError.calledOnce).to.be.true;
    });

    it('does not add error when age is within range', () => {
      const errors = makeErrors();
      const fields = { remarriage: { ageAtMarriage: '25' } };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.ageAtMarriage.addError.called).to.be.false;
    });

    it('does not add error when age is exactly 130', () => {
      const errors = makeErrors();
      const fields = { remarriage: { ageAtMarriage: '130' } };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.ageAtMarriage.addError.called).to.be.false;
    });

    it('does not add error when age is exactly 0', () => {
      const errors = makeErrors();
      const fields = { remarriage: { ageAtMarriage: '0' } };
      marriageDateValidation(errors, fields);
      expect(errors.remarriage.ageAtMarriage.addError.called).to.be.false;
    });
  });

  describe('terminationDateValidation', () => {
    const makeErrors = () => ({
      remarriage: {
        terminationDate: { addError: sinon.spy() },
      },
    });

    it('adds error when termination date is before marriage date', () => {
      const errors = makeErrors();
      const fields = { remarriage: { terminationDate: '2019-01-01' } };
      const formData = { remarriage: { dateOfMarriage: '2020-06-15' } };
      terminationDateValidation(errors, fields, formData);
      expect(errors.remarriage.terminationDate.addError.calledOnce).to.be.true;
    });

    it('adds error when termination date equals marriage date', () => {
      const errors = makeErrors();
      const fields = { remarriage: { terminationDate: '2020-06-15' } };
      const formData = { remarriage: { dateOfMarriage: '2020-06-15' } };
      terminationDateValidation(errors, fields, formData);
      expect(errors.remarriage.terminationDate.addError.calledOnce).to.be.true;
    });

    it('does not add error when termination date is after marriage date', () => {
      const errors = makeErrors();
      const fields = { remarriage: { terminationDate: '2022-01-01' } };
      const formData = { remarriage: { dateOfMarriage: '2020-06-15' } };
      terminationDateValidation(errors, fields, formData);
      expect(errors.remarriage.terminationDate.addError.called).to.be.false;
    });

    it('does not add error when dates are missing', () => {
      const errors = makeErrors();
      terminationDateValidation(errors, { remarriage: {} }, { remarriage: {} });
      expect(errors.remarriage.terminationDate.addError.called).to.be.false;
    });
  });

  describe('terminationStatus', () => {
    it('exports uiSchema and schema', () => {
      expect(terminationStatus).to.have.property('uiSchema');
      expect(terminationStatus).to.have.property('schema');
    });

    it('has hasTerminated field', () => {
      expect(terminationStatus.uiSchema.remarriage).to.have.property(
        'hasTerminated',
      );
      expect(
        terminationStatus.schema.properties.remarriage.properties,
      ).to.have.property('hasTerminated');
    });

    it('hasTerminated is required', () => {
      expect(
        terminationStatus.schema.properties.remarriage.required,
      ).to.include('hasTerminated');
    });
  });
});
