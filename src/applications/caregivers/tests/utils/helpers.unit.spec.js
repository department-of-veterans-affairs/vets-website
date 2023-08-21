import { expect } from 'chai';
import formConfig from '../../config/form';
import {
  veteranFields,
  primaryCaregiverFields,
  secondaryOneFields,
  secondaryTwoFields,
} from '../../definitions/constants';
import {
  submitTransform,
  isSSNUnique,
  arrayToSentenceString,
} from '../../utils/helpers';

// data
import requiredOnly from '../e2e/fixtures/data/requiredOnly.json';
import secondaryTwoOnly from '../e2e/fixtures/data/secondaryOneOnly.json';
import oneSecondaryCaregivers from '../e2e/fixtures/data/oneSecondaryCaregivers.json';
import twoSecondaryCaregivers from '../e2e/fixtures/data/twoSecondaryCaregivers.json';
import signAsRepresentativeNo from '../e2e/fixtures/data/signAsRepresentativeNo.json';

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
      'signature',
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
      'signature',
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
      'signature',
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
      'signature',
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
      'signature',
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
      'signature',
      'dateOfBirth',
      'gender',
    ]);
    expect(secondaryOneKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'signature',
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
      'signature',
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
      'signature',
      'dateOfBirth',
      'gender',
    ]);
    expect(secondaryOneKeys).to.deep.equal([
      'address',
      'primaryPhoneNumber',
      'email',
      'vetRelationship',
      'fullName',
      'signature',
      'dateOfBirth',
    ]);
    expect(secondaryTwoKeys).to.deep.equal([
      'address',
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
    const form = {
      data: signAsRepresentativeNo,
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
      'signature',
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
      'signature',
      'dateOfBirth',
      'gender',
    ]);

    expect(payloadObject.poaAttachmentId).to.be.undefined;
  });

  it('isSSNUnique should not count a party that is not present', () => {
    const formData = {
      [veteranFields.ssn]: '222332222',
      [primaryCaregiverFields.hasPrimaryCaregiver]: true,
      [primaryCaregiverFields.ssn]: '111332356',
      [primaryCaregiverFields.hasSecondaryCaregiverOne]: false,
      [secondaryOneFields.ssn]: '222332222',
      [secondaryOneFields.hasSecondaryCaregiverTwo]: true,
      [secondaryTwoFields.ssn]: '222332221',
    };

    const areSSNsUnique = isSSNUnique(formData);

    expect(areSSNsUnique).to.be.true;
  });

  it('isSSNUnique should return false if a SSN is the same and both are present', () => {
    const formData = {
      [veteranFields.ssn]: '222332222',
      [primaryCaregiverFields.hasPrimaryCaregiver]: true,
      [primaryCaregiverFields.ssn]: '111332356',
      [primaryCaregiverFields.hasSecondaryCaregiverOne]: true,
      [secondaryOneFields.ssn]: '444332111',
      [secondaryOneFields.hasSecondaryCaregiverTwo]: true,
      [secondaryTwoFields.ssn]: '222332222',
    };

    const areSSNsUnique = isSSNUnique(formData);

    expect(areSSNsUnique).to.be.false;
  });

  it('isSSNUnique should return true if all SSNs are different', () => {
    const formData = {
      [veteranFields.ssn]: '222332222',
      [primaryCaregiverFields.hasPrimaryCaregiver]: true,
      [primaryCaregiverFields.ssn]: '111332356',
      [primaryCaregiverFields.hasSecondaryCaregiverOne]: true,
      [secondaryOneFields.ssn]: '444332111',
      [secondaryOneFields.hasSecondaryCaregiverTwo]: true,
      [secondaryTwoFields.ssn]: '222332245',
    };

    const areSSNsUnique = isSSNUnique(formData);

    expect(areSSNsUnique).to.be.true;
  });

  it('isSSNUnique should return true and not count SSNs if they are undefined', () => {
    const formData = {
      [veteranFields.ssn]: '222332222',
      [primaryCaregiverFields.hasPrimaryCaregiver]: true,
      [primaryCaregiverFields.ssn]: '111332356',
      [primaryCaregiverFields.hasSecondaryCaregiverOne]: true,
      [secondaryOneFields.ssn]: undefined,
      [secondaryOneFields.hasSecondaryCaregiverTwo]: true,
      [secondaryTwoFields.ssn]: undefined,
    };

    const areSSNsUnique = isSSNUnique(formData);

    expect(areSSNsUnique).to.be.true;
  });

  describe('arrayToSentenceString', () => {
    it('should return empty string when not an array', () => {
      const sentence = arrayToSentenceString('array', 'or');

      expect(sentence).to.equal('');
    });

    it('should return empty string when array is empty', () => {
      const sentence = arrayToSentenceString([], 'or');

      expect(sentence).to.equal('');
    });

    it('should return item unformatted when array constains only one item', () => {
      const onlyItem = 'MyOnlyItem';
      const sentence = arrayToSentenceString([onlyItem], 'or');

      expect(sentence).to.equal(onlyItem);
    });

    it('should return item transformed without conjunction when array constains only one item', () => {
      const transform = value => `(${value})`;
      const sentence = arrayToSentenceString(['MyOnlyItem'], 'or', transform);

      expect(sentence).to.equal('(MyOnlyItem)');
    });

    it('should return formated string with conjunction without transform function', () => {
      const inputArray = ['Ed', 'Edd', 'Eddy'];
      const sentence = arrayToSentenceString(inputArray, 'and');

      expect(sentence).to.equal('Ed, Edd, and Eddy');
    });

    it('should return formated string with conjunction with transform function', () => {
      const transform = value => `(${value})`;
      const inputArray = ['*.*', '^.^', 'O.O'];
      const sentence = arrayToSentenceString(inputArray, 'and', transform);

      expect(sentence).to.equal('(*.*), (^.^), and (O.O)');
    });
  });
});
