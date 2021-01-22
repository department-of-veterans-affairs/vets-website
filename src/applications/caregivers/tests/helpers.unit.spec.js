import { submitTransform } from '../helpers';
import { expect } from 'chai';
import formConfig from 'applications/caregivers/config/form';

// data
import requiredOnly from './e2e/fixtures/data/requiredOnly.json';
import secondaryTwoOnly from './e2e/fixtures/data/secondaryOneOnly.json';
import oneSecondaryCaregivers from './e2e/fixtures/data/oneSecondaryCaregivers.json';
import twoSecondaryCaregivers from './e2e/fixtures/data/twoSecondaryCaregivers.json';

describe('Caregivers helpers', () => {
  it('should transform required parties correctly (minimal with primary)', () => {
    const form = {
      data: requiredOnly,
    };

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    const veteranKeys = Object.keys(payloadObject.veteran);
    const primaryKeys = Object.keys(payloadObject.primaryCaregiver);

    expect(veteranKeys).to.deep.equal([
      'plannedClinic',
      'address',
      'primaryPhoneNumber',
      'fullName',
      'ssnOrTin',
      'dateOfBirth',
      'gender',
    ]);
    expect(primaryKeys).to.deep.equal([
      'hasHealthInsurance',
      'address',
      'primaryPhoneNumber',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
    expect(payloadObject?.secondaryOne).to.equal(undefined);
    expect(payloadObject?.secondaryOne).to.equal(undefined);
  });

  it('should transform required parties correctly (minimal with secondaryOne)', () => {
    const form = {
      data: secondaryTwoOnly,
    };

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    const veteranKeys = Object.keys(payloadObject.veteran);
    const secondaryOneKeys = Object.keys(payloadObject.secondaryCaregiverOne);

    expect(veteranKeys).to.deep.equal([
      'lastTreatmentFacility',
      'plannedClinic',
      'address',
      'primaryPhoneNumber',
      'fullName',
      'ssnOrTin',
      'dateOfBirth',
      'gender',
    ]);
    expect(secondaryOneKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
    expect(payloadObject?.secondaryOne).to.equal(undefined);
    expect(payloadObject?.secondaryTwo).to.equal(undefined);
  });

  it('should transform required parties plus Secondary One correctly', () => {
    const form = {
      data: oneSecondaryCaregivers,
    };

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    const veteranKeys = Object.keys(payloadObject.veteran);
    const primaryKeys = Object.keys(payloadObject.primaryCaregiver);
    const secondaryOneKeys = Object.keys(payloadObject.secondaryCaregiverOne);

    expect(veteranKeys).to.deep.equal([
      'lastTreatmentFacility',
      'plannedClinic',
      'address',
      'primaryPhoneNumber',
      'fullName',
      'ssnOrTin',
      'dateOfBirth',
      'gender',
    ]);
    expect(primaryKeys).to.deep.equal([
      'hasHealthInsurance',
      'address',
      'primaryPhoneNumber',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
    expect(secondaryOneKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
    expect(payloadObject?.secondaryTwo).to.equal(undefined);
  });

  it('should transform all parties correctly', () => {
    const form = {
      data: twoSecondaryCaregivers,
    };

    const transformedData = submitTransform(formConfig, form);
    const payloadData = JSON.parse(transformedData);
    const payloadObject = JSON.parse(
      payloadData.caregiversAssistanceClaim.form,
    );

    const veteranKeys = Object.keys(payloadObject.veteran);
    const primaryKeys = Object.keys(payloadObject.primaryCaregiver);
    const secondaryOneKeys = Object.keys(payloadObject.secondaryCaregiverOne);
    const secondaryTwoKeys = Object.keys(payloadObject.secondaryCaregiverTwo);

    expect(veteranKeys).to.deep.equal([
      'lastTreatmentFacility',
      'plannedClinic',
      'address',
      'primaryPhoneNumber',
      'fullName',
      'ssnOrTin',
      'dateOfBirth',
      'gender',
    ]);
    expect(primaryKeys).to.deep.equal([
      'hasHealthInsurance',
      'address',
      'primaryPhoneNumber',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
    expect(secondaryOneKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
    ]);
    expect(secondaryTwoKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'dateOfBirth',
      'gender',
    ]);
  });
});
