import { expect } from 'chai';

import marriageInfo from '../../pages/marriageInfo';
import marriageRecognition from '../../pages/marriageRecognition';
import spouseVeteranId from '../../pages/spouseVeteranId';
import spouseVeteranStatus from '../../pages/spouseVeteranStatus';
import terminationDetails from '../../pages/terminationDetails';

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
  });

  describe('marriageRecognition', () => {
    it('exports uiSchema and schema', () => {
      expect(marriageRecognition).to.have.property('uiSchema');
      expect(marriageRecognition).to.have.property('schema');
    });

    it('has ui:description that is a React component', () => {
      const description = marriageRecognition.uiSchema['ui:description'];
      expect(description).to.be.a('function');
    });

    it('renders MarriageRecognitionInfo component', () => {
      const MarriageRecognitionInfo =
        marriageRecognition.uiSchema['ui:description'];
      const component = MarriageRecognitionInfo();
      expect(component).to.exist;
    });
  });

  describe('spouseVeteranId', () => {
    it('exports uiSchema and schema', () => {
      expect(spouseVeteranId).to.have.property('uiSchema');
      expect(spouseVeteranId).to.have.property('schema');
    });

    it('has required function for spouse veteran ID', () => {
      const required =
        spouseVeteranId.uiSchema.remarriage.spouseVeteranId['ui:required'];
      expect(required).to.be.a('function');
      expect(required()).to.be.true;
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
  });
});
