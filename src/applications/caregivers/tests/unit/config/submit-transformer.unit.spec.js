import { expect } from 'chai';
import formConfig from '../../../config/form';
import submitTransformer from '../../../config/submit-transformer';
import requiredOnly from '../../e2e/fixtures/data/requiredOnly.json';
import secondaryOneOnly from '../../e2e/fixtures/data/secondaryOneOnly.json';
import oneSecondaryCaregiver from '../../e2e/fixtures/data/oneSecondaryCaregiver.json';
import twoSecondaryCaregivers from '../../e2e/fixtures/data/twoSecondaryCaregivers.json';
import signAsRepresentativeNo from '../../e2e/fixtures/data/signAsRepresentativeNo.json';
import signAsRepresentativeYes from '../../e2e/fixtures/data/signAsRepresentativeYes.json';
import { mockFetchFacilitiesResponse } from '../../mocks/responses';

describe('CG `submitTransformer` method', () => {
  it('should transform required parties correctly (minimal with primary)', () => {
    const formData = { data: requiredOnly };
    const transformedData = submitTransformer(formConfig, formData);
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
    const transformedData = submitTransformer(formConfig, formData);
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

  it('should transform required parties plus secondaryOne correctly', () => {
    const formData = { data: oneSecondaryCaregiver };
    const transformedData = submitTransformer(formConfig, formData);
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
    const transformedData = submitTransformer(formConfig, form);
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

  it('should include POA attachment ID if yes/no/no is `yes`', () => {
    const formData = { data: signAsRepresentativeYes };
    const transformedData = submitTransformer(formConfig, formData);
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

    expect(poaAttachmentId).to.be.a('string');
  });

  it('should remove POA attachment ID if yes/no/no is `no`', () => {
    const formData = { data: signAsRepresentativeNo };
    const transformedData = submitTransformer(formConfig, formData);
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

  context('view:useFacilitiesAPI is turned on', () => {
    it('sets plannedClinic from view:plannedClinic', () => {
      const veteranSelectedPlannedClinic = mockFetchFacilitiesResponse[0];
      const plannedClinicId = veteranSelectedPlannedClinic.id.split('_').pop();

      const requiredOnlyFormData = {
        ...requiredOnly,
        'view:useFacilitiesAPI': true,
        'view:plannedClinic': veteranSelectedPlannedClinic,
      };

      const formData = { data: requiredOnlyFormData };
      const transformedData = submitTransformer(formConfig, formData);
      const { caregiversAssistanceClaim } = JSON.parse(transformedData);
      const { veteran } = JSON.parse(caregiversAssistanceClaim.form);

      const veteranKeys = Object.keys(veteran);

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
      expect(veteran.plannedClinic).to.equal(plannedClinicId);
    });
  });
});
