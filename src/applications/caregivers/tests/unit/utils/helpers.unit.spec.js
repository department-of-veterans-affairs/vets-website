import { expect } from 'chai';
import formConfig from '../../../config/form';
import { submitTransform } from '../../../utils/helpers';
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
});
