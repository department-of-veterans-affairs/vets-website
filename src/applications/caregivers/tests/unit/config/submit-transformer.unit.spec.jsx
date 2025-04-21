import { expect } from 'chai';
import formConfig from '../../../config/form';
import submitTransformer from '../../../config/submit-transformer';
import requiredOnly from '../../e2e/fixtures/data/requiredOnly.json';
import secondaryOneOnly from '../../e2e/fixtures/data/secondaryOneOnly.json';
import oneSecondaryCaregiver from '../../e2e/fixtures/data/oneSecondaryCaregiver.json';
import twoSecondaryCaregivers from '../../e2e/fixtures/data/twoSecondaryCaregivers.json';
import signAsRepresentativeNo from '../../e2e/fixtures/data/signAsRepresentativeNo.json';
import signAsRepresentativeYes from '../../e2e/fixtures/data/signAsRepresentativeYes.json';
import { mockFetchFacilitiesResponse } from '../../mocks/fetchFacility';

// declare helpers to parse form data
const parseTransformedForm = transformed =>
  JSON.parse(JSON.parse(transformed).caregiversAssistanceClaim.form);

const transformAndExtract = data =>
  parseTransformedForm(submitTransformer(formConfig, { data }));

// declare expected data keys by role
const veteranExpectedKeys = [
  'plannedClinic',
  'address',
  'primaryPhoneNumber',
  'fullName',
  'signature',
  'ssnOrTin',
  'dateOfBirth',
  'gender',
];

const primaryCaregiverExpectedKeys = [
  'address',
  'mailingAddress',
  'primaryPhoneNumber',
  'vetRelationship',
  'fullName',
  'signature',
  'dateOfBirth',
  'gender',
];

const secondaryCaregiverExpectedKeys = [
  ...primaryCaregiverExpectedKeys,
  'email',
];

describe('CG `submitTransformer` method', () => {
  const testCases = [
    {
      title:
        'should transform required parties correctly (minimal with primary)',
      fixture: requiredOnly,
      expected: {
        primary: true,
        secondaryOne: false,
        secondaryTwo: false,
      },
    },
    {
      title:
        'should transform required parties correctly (minimal with secondaryOne)',
      fixture: secondaryOneOnly,
      expected: {
        primary: false,
        secondaryOne: true,
        secondaryTwo: false,
      },
    },
    {
      title: 'should transform required parties plus secondaryOne correctly',
      fixture: oneSecondaryCaregiver,
      expected: {
        primary: true,
        secondaryOne: true,
        secondaryTwo: false,
      },
    },
    {
      title: 'should transform all parties correctly',
      fixture: twoSecondaryCaregivers,
      expected: {
        primary: true,
        secondaryOne: true,
        secondaryTwo: true,
      },
    },
  ];

  testCases.forEach(({ title, fixture, expected }) => {
    it(title, () => {
      const {
        veteran,
        primaryCaregiver,
        secondaryCaregiverOne,
        secondaryCaregiverTwo,
      } = transformAndExtract(fixture);

      // check veteran data keys
      expect(Object.keys(veteran)).to.have.members(veteranExpectedKeys);

      // check primary caregiver data keys, if expected
      if (expected.primary) {
        expect(Object.keys(primaryCaregiver)).to.have.members(
          primaryCaregiverExpectedKeys,
        );
      } else {
        expect(primaryCaregiver).to.be.undefined;
      }

      // check secondary one data keys, if expected
      if (expected.secondaryOne) {
        expect(Object.keys(secondaryCaregiverOne)).to.have.members(
          secondaryCaregiverExpectedKeys,
        );
      } else {
        expect(secondaryCaregiverOne).to.be.undefined;
      }

      // check secondary two data keys, if expected
      if (expected.secondaryTwo) {
        expect(Object.keys(secondaryCaregiverTwo)).to.have.members(
          secondaryCaregiverExpectedKeys,
        );
      } else {
        expect(secondaryCaregiverTwo).to.be.undefined;
      }
    });
  });

  it('should include POA attachment ID if yes/no/no is `yes`', () => {
    const { veteran, primaryCaregiver, poaAttachmentId } = transformAndExtract(
      signAsRepresentativeYes,
    );
    expect(Object.keys(veteran)).to.have.members(veteranExpectedKeys);
    expect(Object.keys(primaryCaregiver)).to.have.members(
      primaryCaregiverExpectedKeys,
    );
    expect(poaAttachmentId).to.be.a('string');
  });

  it('should omit POA attachment ID if yes/no/no is `no`', () => {
    const { veteran, primaryCaregiver, poaAttachmentId } = transformAndExtract(
      signAsRepresentativeNo,
    );
    expect(Object.keys(veteran)).to.have.members(veteranExpectedKeys);
    expect(Object.keys(primaryCaregiver)).to.have.members(
      primaryCaregiverExpectedKeys,
    );
    expect(poaAttachmentId).to.be.undefined;
  });

  it('should set `plannedClinic` from `view:plannedClinic` when facilites feature flag is enabled', () => {
    const { facilities } = mockFetchFacilitiesResponse;
    const veteranSelectedPlannedClinic = facilities[0];
    const plannedClinicId = veteranSelectedPlannedClinic.id.split('_').pop();
    const fixture = {
      ...requiredOnly,
      'view:useFacilitiesAPI': true,
      'view:plannedClinic': {
        caregiverSupport: veteranSelectedPlannedClinic,
      },
    };
    const { veteran } = transformAndExtract(fixture);
    expect(Object.keys(veteran)).to.have.members(veteranExpectedKeys);
    expect(veteran.plannedClinic).to.eq(plannedClinicId);
  });
});
