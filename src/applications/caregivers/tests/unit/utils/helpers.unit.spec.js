import { expect } from 'chai';
import formConfig from '../../../config/form';
import { submitTransform, isSsnUnique } from '../../../utils/helpers';
import requiredOnly from '../../e2e/fixtures/data/requiredOnly.json';
import secondaryOneOnly from '../../e2e/fixtures/data/secondaryOneOnly.json';
import oneSecondaryCaregiver from '../../e2e/fixtures/data/oneSecondaryCaregiver.json';
import twoSecondaryCaregivers from '../../e2e/fixtures/data/twoSecondaryCaregivers.json';
import signAsRepresentativeNo from '../../e2e/fixtures/data/signAsRepresentativeNo.json';

describe('CG helpers', () => {
  context('when `submitTransform` executes', () => {
    it('should transform required parties correctly (minimal with primary)', () => {
      const formData = { data: requiredOnly };
      const transformedData = submitTransform(formConfig, formData);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const {
        veteran,
        primaryCaregiver,
        secondaryCaregiverOne,
        secondaryCaregiverTwo,
      } = JSON.parse(caregiversAssistanceClaim.form);

      const veteranKeys = Object.keys(veteran);
      const primaryKeys = Object.keys(primaryCaregiver);

      expect(veteranKeys).to.deep.equal([
        'plannedClinic',
        'address',
        'primaryPhoneNumber',
        'fullName',
        'signature',
        'ssnOrTin',
        'dateOfBirth',
        'gender',
      ]);
      expect(primaryKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
      expect(secondaryCaregiverOne).to.be.undefined;
      expect(secondaryCaregiverTwo).to.be.undefined;
    });

    it('should transform required parties correctly (minimal with secondaryOne)', () => {
      const formData = { data: secondaryOneOnly };
      const transformedData = submitTransform(formConfig, formData);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const {
        veteran,
        primaryCaregiver,
        secondaryCaregiverOne,
        secondaryCaregiverTwo,
      } = JSON.parse(caregiversAssistanceClaim.form);

      const veteranKeys = Object.keys(veteran);
      const secondaryOneKeys = Object.keys(secondaryCaregiverOne);

      expect(veteranKeys).to.deep.equal([
        'plannedClinic',
        'address',
        'primaryPhoneNumber',
        'fullName',
        'signature',
        'ssnOrTin',
        'dateOfBirth',
        'gender',
      ]);
      expect(secondaryOneKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'email',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
      expect(primaryCaregiver).to.be.undefined;
      expect(secondaryCaregiverTwo).to.be.undefined;
    });

    it('should transform required parties plus Secondary One correctly', () => {
      const formData = { data: oneSecondaryCaregiver };
      const transformedData = submitTransform(formConfig, formData);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const {
        veteran,
        primaryCaregiver,
        secondaryCaregiverOne,
        secondaryCaregiverTwo,
      } = JSON.parse(caregiversAssistanceClaim.form);

      const veteranKeys = Object.keys(veteran);
      const primaryKeys = Object.keys(primaryCaregiver);
      const secondaryOneKeys = Object.keys(secondaryCaregiverOne);

      expect(veteranKeys).to.deep.equal([
        'plannedClinic',
        'address',
        'primaryPhoneNumber',
        'fullName',
        'signature',
        'ssnOrTin',
        'dateOfBirth',
        'gender',
      ]);
      expect(primaryKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
      expect(secondaryOneKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'email',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
      expect(secondaryCaregiverTwo).to.be.undefined;
    });

    it('should transform all parties correctly', () => {
      const form = { data: twoSecondaryCaregivers };
      const transformedData = submitTransform(formConfig, form);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const {
        veteran,
        primaryCaregiver,
        secondaryCaregiverOne,
        secondaryCaregiverTwo,
      } = JSON.parse(caregiversAssistanceClaim.form);

      const veteranKeys = Object.keys(veteran);
      const primaryKeys = Object.keys(primaryCaregiver);
      const secondaryOneKeys = Object.keys(secondaryCaregiverOne);
      const secondaryTwoKeys = Object.keys(secondaryCaregiverTwo);

      expect(veteranKeys).to.deep.equal([
        'plannedClinic',
        'address',
        'primaryPhoneNumber',
        'fullName',
        'signature',
        'ssnOrTin',
        'dateOfBirth',
        'gender',
      ]);
      expect(primaryKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
      expect(secondaryOneKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'email',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
      ]);
      expect(secondaryTwoKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'email',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);
    });

    it('should remove POA ID if yes/no/no is no', () => {
      const formData = { data: signAsRepresentativeNo };
      const transformedData = submitTransform(formConfig, formData);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const { veteran, primaryCaregiver, poaAttachmentId } = JSON.parse(
        caregiversAssistanceClaim.form,
      );

      const veteranKeys = Object.keys(veteran);
      const primaryKeys = Object.keys(primaryCaregiver);

      expect(veteranKeys).to.deep.equal([
        'plannedClinic',
        'address',
        'primaryPhoneNumber',
        'fullName',
        'signature',
        'ssnOrTin',
        'dateOfBirth',
        'gender',
      ]);
      expect(primaryKeys).to.deep.equal([
        'address',
        'mailingAddress',
        'primaryPhoneNumber',
        'vetRelationship',
        'fullName',
        'signature',
        'dateOfBirth',
        'gender',
      ]);

      expect(poaAttachmentId).to.be.undefined;
    });
  });

  context('when `isSsnUnique` executes', () => {
    it(' should not count a party that is not present', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': false,
        secondaryOneSsnOrTin: '222332222',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332221',
      };
      expect(isSsnUnique(formData)).to.be.true;
    });

    it('should return `false` if SSN is the same and both are present', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: '444332111',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332222',
      };
      expect(isSsnUnique(formData)).to.be.false;
    });

    it('should return `true` if all SSNs are different', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: '444332111',
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: '222332245',
      };
      expect(isSsnUnique(formData)).to.be.true;
    });

    it('should return `true` and not count SSNs if they are undefined', () => {
      const formData = {
        veteranSsnOrTin: '222332222',
        'view:hasPrimaryCaregiver': true,
        primarySsnOrTin: '111332356',
        'view:hasSecondaryCaregiverOne': true,
        secondaryOneSsnOrTin: undefined,
        'view:hasSecondaryCaregiverTwo': true,
        secondaryTwoSsnOrTin: undefined,
      };
      expect(isSsnUnique(formData)).to.be.true;
    });
  });
});
