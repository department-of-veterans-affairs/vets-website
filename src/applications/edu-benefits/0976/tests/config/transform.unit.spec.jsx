import { expect } from 'chai';
import transform from '../../config/transform';
import { todaysDate } from '../../helpers';

describe('transform function', () => {
  it('should transform form data correctly', () => {
    const formConfig = {};
    const form = {
      data: {
        schoolCertifyingOfficial: {
          fullName: {
            first: 'Johnny',
            last: 'John',
          },
          email: 'johnny@example.com',
        },
        financialRepresentative: {
          fullName: {
            first: 'Patty',
            last: 'Patt',
          },
          email: 'patty@example.com',
        },
        isMedicalSchool: false,
        institutionProfile: {
          participatesInTitleIv: false,
          isIhl: true,
          ihlDegreeTypes: 'Bachelor',
        },
        submissionReasons: {
          initialApplication: true,
        },
        website: 'https://www.example.com',
        primaryInstitutionDetails: {
          name: 'Test University',
          mailingAddress: {
            country: 'USA',
            street: '123 Maple Ln',
            city: 'New York',
            state: 'NY',
            postalCode: '12345',
          },
          type: 'PUBLIC',
          physicalAddress: {},
        },
        hasVaFacilityCode: false,
        acknowledgement10b: 'JD',
        acknowledgement10a: {
          financiallySound: true,
        },
        acknowledgement9: 'JD',
        acknowledgement8: 'JD',
        acknowledgement7: 'JD',
        authorizingOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
        additionalInstitutions: [
          {
            name: 'Another Site',
            mailingAddress: {
              'view:militaryBaseDescription': {},
              country: 'USA',
              street: '456 Maple Ave.',
              city: 'Trenton',
              state: 'NJ',
              postalCode: '54321',
            },
          },
        ],
        programs: [
          {
            programName: 'Program 1',
            totalProgramLength: '1 Semester',
            weeksPerTerm: '16',
            entryRequirements: 'Bachelors',
            creditHours: '16',
          },
          {
            programName: 'Level 2',
            totalProgramLength: 'Timeless',
            weeksPerTerm: '99',
            entryRequirements: 'None',
            creditHours: '99',
          },
        ],
        officials: [
          {
            fullName: {
              first: 'Extra',
              last: 'Member',
            },
            title: 'President',
          },
        ],
        statementOfTruthSignature: 'John Doe',
        isAuthenticated: false,
      },
    };

    const result = transform(formConfig, form);
    const parsedData = JSON.parse(
      JSON.parse(result).educationBenefitsClaim.form,
    );

    expect(parsedData).to.deep.equal({
      submissionReasons: {
        initialApplication: true,
        approvalOfNewPrograms: false,
        reapproval: false,
        updateInformation: false,
        other: false,
      },
      authorizingOfficial: {
        fullName: { first: 'John', last: 'Doe' },
        signature: 'John Doe',
      },
      acknowledgement7: 'JD',
      acknowledgement8: 'JD',
      acknowledgement9: 'JD',
      acknowledgement10a: { financiallySound: true },
      acknowledgement10b: 'JD',
      institutionProfile: {
        isIHL: true,
        ihlDegreeTypes: 'Bachelor',
        participatesInTitleIV: false,
      },
      website: 'https://www.example.com',
      institutionClassification: 'public',
      institutionDetails: [
        {
          institutionName: 'Test University',
          isForeignCountry: false,
          mailingAddress: {
            country: 'USA',
            street: '123 Maple Ln',
            city: 'New York',
            state: 'NY',
            postalCode: '12345',
          },
        },
        {
          institutionName: 'Another Site',
          isForeignCountry: false,
          mailingAddress: {
            country: 'USA',
            street: '456 Maple Ave.',
            city: 'Trenton',
            state: 'NJ',
            postalCode: '54321',
          },
        },
      ],
      programs: [
        {
          programName: 'Program 1',
          totalProgramLength: '1 Semester',
          weeksPerTerm: 16,
          entryRequirements: 'Bachelors',
          creditHours: 16,
        },
        {
          programName: 'Level 2',
          totalProgramLength: 'Timeless',
          weeksPerTerm: 99,
          entryRequirements: 'None',
          creditHours: 99,
        },
      ],
      isMedicalSchool: false,
      listedInWDOMS: false,
      financialRepresentative: {
        fullName: { first: 'Patty', last: 'Patt' },
        email: 'patty@example.com',
      },
      schoolCertifyingOfficial: {
        fullName: { first: 'Johnny', last: 'John' },
        email: 'johnny@example.com',
      },
      dateSigned: todaysDate(),
      isAuthenticated: false,
    });
  });
});
