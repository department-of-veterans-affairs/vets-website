import { expect } from 'chai';
import {
  hideCaregiverRequiredAlert,
  hideUploadWarningAlert,
  primaryHasDifferentMailingAddress,
  secondaryOneHasDifferentMailingAddress,
  secondaryTwoHasDifferentMailingAddress,
} from '../../../../utils/helpers/form-config';

describe('CG `hideCaregiverRequiredAlert` method', () => {
  it('should return `true` when primary caregiver is defined', () => {
    const formData = { 'view:hasPrimaryCaregiver': true };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `true` when secondary caregiver is defined', () => {
    const formData = { 'view:hasSecondaryCaregiverOne': true };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `true` when secondary caregiver is undefined', () => {
    const formData = {
      'view:hasPrimaryCaregiver': false,
      'view:hasSecondaryCaregiverOne': undefined,
    };
    expect(hideCaregiverRequiredAlert(formData)).to.be.true;
  });

  it('should return `false` when no caregiver is defined', () => {
    const formData = {
      'view:hasPrimaryCaregiver': false,
      'view:hasSecondaryCaregiverOne': false,
    };
    expect(hideCaregiverRequiredAlert(formData)).to.be.false;
  });
});

describe('CG `hideUploadWarningAlert` method', () => {
  it('should return `true` when file data contains an error message', () => {
    const formData = {
      signAsRepresentativeDocumentUpload: [
        { name: 'test-name', guid: 'test-guid', errorMessage: 'test-error' },
      ],
    };
    expect(hideUploadWarningAlert(formData)).to.be.true;
  });

  it('should return `false` when valid file data exists', () => {
    const formData = {
      signAsRepresentativeDocumentUpload: [
        { name: 'test-name', guid: 'test-guid' },
      ],
    };
    expect(hideUploadWarningAlert(formData)).to.be.false;
  });

  it('should return `false` if upload array is empty', () => {
    const formData = { signAsRepresentativeDocumentUpload: [] };
    expect(hideUploadWarningAlert(formData)).to.be.false;
  });
});

describe('CG `primaryHasDifferentMailingAddress` method', () => {
  it('should return `false` when primary caregiver is not defined', () => {
    const formData = { 'view:hasPrimaryCaregiver': false };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasPrimaryCaregiver': true,
      'view:primaryHomeSameAsMailingAddress': true,
    };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasPrimaryCaregiver': true,
      'view:primaryHomeSameAsMailingAddress': false,
    };
    expect(primaryHasDifferentMailingAddress(formData)).to.be.true;
  });
});

describe('CG `secondaryOneHasDifferentMailingAddress` method', () => {
  it('should return `false` when primary caregiver is not defined', () => {
    const formData = { 'view:hasSecondaryCaregiverOne': false };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:secondaryOneHomeSameAsMailingAddress': true,
    };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasSecondaryCaregiverOne': true,
      'view:secondaryOneHomeSameAsMailingAddress': false,
    };
    expect(secondaryOneHasDifferentMailingAddress(formData)).to.be.true;
  });
});

describe('CG `secondaryTwoHasDifferentMailingAddress` method', () => {
  it('should return `false` when primary caregiver is not defined', () => {
    const formData = { 'view:hasSecondaryCaregiverTwo': false };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `false` when user indicates home & mailing addresses are the same', () => {
    const formData = {
      'view:hasSecondaryCaregiverTwo': true,
      'view:secondaryTwoHomeSameAsMailingAddress': true,
    };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.false;
  });

  it('should return `true` when user indicates home & mailing addresses are different', () => {
    const formData = {
      'view:hasSecondaryCaregiverTwo': true,
      'view:secondaryTwoHomeSameAsMailingAddress': false,
    };
    expect(secondaryTwoHasDifferentMailingAddress(formData)).to.be.true;
  });
});
