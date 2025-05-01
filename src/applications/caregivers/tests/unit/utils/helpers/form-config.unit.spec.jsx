import { expect } from 'chai';
import {
  hideCaregiverRequiredAlert,
  hideUploadWarningAlert,
  primaryHasDifferentMailingAddress,
  secondaryOneHasDifferentMailingAddress,
  secondaryTwoHasDifferentMailingAddress,
  showFacilityConfirmation,
} from '../../../../utils/helpers';

describe('CG `hideCaregiverRequiredAlert` method', () => {
  const testCases = [
    {
      title: 'should return `true` when primary caregiver is defined',
      data: { 'view:hasPrimaryCaregiver': true },
      expected: true,
    },
    {
      title: 'should return `true` when secondary caregiver is defined',
      data: { 'view:hasSecondaryCaregiverOne': true },
      expected: true,
    },
    {
      title: 'should return `true` when secondary caregiver is undefined',
      data: {
        'view:hasPrimaryCaregiver': false,
        'view:hasSecondaryCaregiverOne': undefined,
      },
      expected: true,
    },
    {
      title: 'should return `false` when no caregiver is defined',
      data: {
        'view:hasPrimaryCaregiver': false,
        'view:hasSecondaryCaregiverOne': false,
      },
      expected: false,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () => expect(hideCaregiverRequiredAlert(data)).to.eq(expected));
  });
});

describe('CG `hideUploadWarningAlert` method', () => {
  const testCases = [
    {
      title: 'should return `true` when file data contains an error message',
      data: {
        signAsRepresentativeDocumentUpload: [
          { name: 'test-name', guid: 'test-guid', errorMessage: 'test-error' },
        ],
      },
      expected: true,
    },
    {
      title: 'should return `true` if upload array is empty',
      data: { signAsRepresentativeDocumentUpload: [] },
      expected: true,
    },
    {
      title: 'should return `false` when valid file data exists',
      data: {
        signAsRepresentativeDocumentUpload: [
          { name: 'test-name', guid: 'test-guid' },
        ],
      },
      expected: false,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () => expect(hideUploadWarningAlert(data)).to.eq(expected));
  });
});

describe('CG `primaryHasDifferentMailingAddress` method', () => {
  const testCases = [
    {
      title: 'should return `false` when primary caregiver is not defined',
      data: { 'view:hasPrimaryCaregiver': false },
      expected: false,
    },
    {
      title:
        'should return `false` when user indicates home & mailing addresses are the same',
      data: {
        'view:hasPrimaryCaregiver': true,
        'view:primaryHomeSameAsMailingAddress': true,
      },
      expected: false,
    },
    {
      title:
        'should return `true` when user indicates home & mailing addresses are different',
      data: {
        'view:hasPrimaryCaregiver': true,
        'view:primaryHomeSameAsMailingAddress': false,
      },
      expected: true,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () =>
      expect(primaryHasDifferentMailingAddress(data)).to.eq(expected),
    );
  });
});

describe('CG `secondaryOneHasDifferentMailingAddress` method', () => {
  const testCases = [
    {
      title: 'should return `false` when secondary caregiver is not defined',
      data: { 'view:hasSecondaryCaregiverOne': false },
      expected: false,
    },
    {
      title:
        'should return `false` when user indicates home & mailing addresses are the same',
      data: {
        'view:hasSecondaryCaregiverOne': true,
        'view:secondaryOneHomeSameAsMailingAddress': true,
      },
      expected: false,
    },
    {
      title:
        'should return `true` when user indicates home & mailing addresses are different',
      data: {
        'view:hasSecondaryCaregiverOne': true,
        'view:secondaryOneHomeSameAsMailingAddress': false,
      },
      expected: true,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () =>
      expect(secondaryOneHasDifferentMailingAddress(data)).to.eq(expected),
    );
  });
});

describe('CG `secondaryTwoHasDifferentMailingAddress` method', () => {
  const testCases = [
    {
      title: 'should return `false` when secondary caregivers are not defined',
      data: {
        'view:hasSecondaryCaregiverOne': false,
        'view:hasSecondaryCaregiverTwo': false,
      },
      expected: false,
    },
    {
      title:
        'should return `false` when user indicates home & mailing addresses are the same',
      data: {
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': true,
        'view:secondaryTwoHomeSameAsMailingAddress': true,
      },
      expected: false,
    },
    {
      title:
        'should return `true` when user indicates home & mailing addresses are different',
      data: {
        'view:hasSecondaryCaregiverOne': true,
        'view:hasSecondaryCaregiverTwo': true,
        'view:secondaryTwoHomeSameAsMailingAddress': false,
      },
      expected: true,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () =>
      expect(secondaryTwoHasDifferentMailingAddress(data)).to.eq(expected),
    );
  });
});

describe('CG `showFacilityConfirmation` method', () => {
  const defaultData = { 'view:useFacilitiesAPI': true };
  const testCases = [
    {
      title: 'should return `false` when feature toggle is disabled',
      data: { 'view:useFacilitiesAPI': false },
      expected: false,
    },
    {
      title:
        'should return `false` when `veteranSelected` and `caregiverSupport` are the same value',
      data: {
        ...defaultData,
        'view:plannedClinic': {
          veteranSelected: { id: 'my-id' },
          caregiverSupport: { id: 'my-id' },
        },
      },
      expected: false,
    },
    {
      title: 'should return `false` when `view:plannedClinic` is undefined',
      data: defaultData,
      expected: false,
    },
    {
      title:
        'should return `false` when `view:plannedClinic` is an empty object',
      data: {
        ...defaultData,
        'view:plannedClinic': {},
      },
      expected: false,
    },
    {
      title: 'should return `false` when `veteranSelected` is an empty object',
      data: {
        ...defaultData,
        'view:plannedClinic': {
          veteranSelected: {},
        },
      },
      expected: false,
    },
    {
      title:
        'should return `true` when `veteranSelected` and `caregiverSupport` are different values',
      data: {
        ...defaultData,
        'view:plannedClinic': {
          veteranSelected: { id: 'my-id' },
          caregiverSupport: { id: 'not-my-id' },
        },
      },
      expected: true,
    },
  ];

  testCases.forEach(({ title, data, expected }) => {
    it(title, () => expect(showFacilityConfirmation(data)).to.eq(expected));
  });
});
