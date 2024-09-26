import { expect } from 'chai';

import {
  setName,
  setBirth,
  setHomeAddress,
  setContactInfo,
  setEmployment,
  setMilitaryService,
  setEmploymentHistory,
  setEducation,
  setJurisdictions,
  setAgencies,
  setCharacterReferences,
  setBackgroundInfo,
} from '../config/submit-transformer';

let transformedData = {};


// const transformedData = {};

describe('setName', () => {
  beforeEach(() => {
    transformedData = {};
  });

  it('should transform the name', () => {
    // const transformedData = {};

    const fullName = {
      first: 'John',
      middle: 'NMN',
      last: 'Johnson',
    };

    const expected = {
      firstName: 'John',
      lastName: 'Johnson',
      middleName: 'NMN',
    };

    setName(fullName);
    console.log(transformedData);
    expect(transformedData).to.eq(expected);
  });
});

describe('setBirth', () => {
  it('should transform the birth data', () => {
    // const transformedData = {};

    const form = {
      data: {
        dateOfBirth: '09211990',
      },
    };

    const placeOfBirth = {
      city: 'Washington',
      state: 'DC',
      country: 'USA',
    };

    const expected = {
      birthDate: '09211990',
      birthCity: 'Washington',
      birthState: 'DC',
      birthCountry: 'USA',
    };

    setBirth(placeOfBirth, form);
    expect(transformedData).to.eq(expected);
  });
});

describe('setHomeAddress', () => {
  it('should transform the home address', () => {
    // const transformedData = {};

    const homeAddress = {
      isMilitary: false,
      street: '123 Main St',
      city: 'Chicago',
      postalCode: '60656',
      country: 'USA',
    };

    const expected = {
      homeAddress: {
        addressType: 'home',
        line1: '123 Main St',
        city: 'Los Angeles',
        postalCode: '94101',
        country: 'USA,',
      },
    };

    setHomeAddress(homeAddress);
    expect(transformedData).to.eq(expected);
  });
});

describe('setContactInfo', () => {
  it('should transform the contact info', () => {
    // const transformedData = {};

    const form = {
      data: {
        phone: '1231231234',
        typeOfPhone: 'mobile',
        email: 'test@va.gov',
      },
    };

    const expected = {
      homePhone: '1231231234',
      phoneTypeId: 2,
      phoneType: {
        name: 'mobile',
      },
      homeEmail: 'test@va.gov',
    };

    setContactInfo(form);
    expect(transformedData).to.eq(expected);
  });
});

describe('setEmployment', () => {
  it('should transform the employment', () => {
    // const transformedData = {};

    const workAddress = {
      isMilitary: false,
      city: 'Chicago',
      state: 'IL',
      postalCode: '12345',
      country: 'USA',
    };

    const form = {
      data: {
        employmentStatus: 'employed',
      },
    };

    const expected = {
      employmentStatus: 'employed',
      employmentStatusId: 1,
      businessAddressId: 1,
      businessAddress: {
        city: 'Chicago',
        state: 'IL',
        postalCode: '12345',
        country: 'USA',
      },
    };

    setEmployment(workAddress, form);
    expect(transformedData).to.eq(expected);
  });
});

describe('setMilitaryService', () => {
  it('should transform the military service', () => {
    // const transformedData = {};

    const militaryServices = [
      {
        explanationOfDischarge: 'left',
        branch: 'Army',
        characterOfDischarge: 'Honorable',
      },
    ];

    const expected = {
      militaryServices: [
        {
          dischargeTypeExplanation: 'None',
          dischargeTypeId: 1,
          serviceBranchId: 2,
          serviceBranch: {
            name: 'Army',
          },
          dischargeType: {
            name: 'Honorable',
          },
        },
      ],
    };

    setMilitaryService(militaryServices);
    expect(transformedData).to.eq(expected);
  });
});

describe('setEmploymentHistory', () => {
  it('should transform the employment history', () => {
    // const transformedData = {};

    const employers = [
      {
        phone: '1233213211',
        extension: '543',
        positionTitle: 'Engineer',
        supervisorName: 'Joe Biden',
        address: {
          isMilitary: false,
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94101',
          country: 'USA',
        },
      },
    ];

    const expected = {
      employment: [
        {
          phoneNumber: '1233213211',
          phoneExtension: '543',
          phoneTypeId: 1,
          positionTitle: 'Engineer',
          supervisorName: 'Joe Biden',
          employerAddressId: 1,
          employerAddress: {
            addressType: false,
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94101',
            country: 'USA',
          },
        },
      ],
    };

    setEmploymentHistory(employers);
    expect(transformedData).to.eq(expected);
  });
});

describe('setEducation', () => {
  it('should transform the education', () => {
    // const transformedData = {};

    const educationalInstitutions = [
      {
        degreeReceived: true,
        major: 'Engineering',
        degree: 'BS',
        address: {
          isMilitary: false,
          street: '123 Main St',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60610',
          country: 'USA',
        },
      },
    ];

    const expected = {
      education: [
        {
          wasDegreeReceived: true,
          major: 'Engineering',
          institutionAddressId: 1,
          degreeTypeId: 1,
          degreeType: {
            name: 'BS',
          },
          institutionAddress: {
            addressType: false,
            line1: '123 Main St',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60610',
            country: 'USA',
          },
        },
      ],
    };

    setEducation(educationalInstitutions);
    expect(transformedData).to.eq(expected);
  });
});

describe('setJurisdictions', () => {
  it('should transform the jurisdictions', () => {
    // const transformedData = {};

    const jurisdictions = [
      {
        jurisdiction: 'CA',
        admissionDate: '09152010',
        membershipOrRegistrationNumber: 'abc123',
      },
    ];

    const expected = {
      jurisdictions: [
        {
          name: 'CA',
          admissionDate: '09152010',
          membershipRegistrationNumber: 'abc123',
          admittanceTypeId: 1,
        },
      ],
    };

    setJurisdictions(jurisdictions);
    expect(transformedData).to.eq(expected);
  });
});

describe('setAgencies', () => {
  it('should transform the agencies', () => {
    // const transformedData = {};

    const agenciesOrCourts = [
      {
        name: 'CA',
        admissionDate: '09152010',
        membershipOrRegistrationNumber: 'abc123',
      },
    ];

    const expected = {
      agencies: [
        {
          name: 'CA',
          admissionDate: '09152010',
          membershipRegistrationNumber: 'abc123',
          admittanceTypeId: 2,
        },
      ],
    };

    setAgencies(agenciesOrCourts);
    expect(transformedData).to.eq(expected);
  });
});

describe('setCharacterReferences', () => {
  it('should transform the character references', () => {
    // const transformedData = {};

    const characterReferences = [
      {
        first: 'John',
        middle: 'Q',
        last: 'Public',
        suffix: 'Sr',
        street: '123 Main St',
        street2: 'Apt 1',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60656',
        country: 'USA',
        isMilitary: false,
        phone: '6546787654',
        email: 'test@va.gov',
        relationship: 'friend',
      },
    ];

    const expected = {
      characterReferences: [
        {
          firstName: 'John',
          middleName: 'Q',
          lastName: 'Public',
          suffix: 'Sr',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 1',
          addressCity: 'Chicago',
          addressState: 'IL',
          addressPostalCode: '60656',
          addressCountry: 'USA',
          addressIsMilitary: false,
          phoneNumber: '6546787654',
          phoneTypeId: 1,
          email: 'test@va.gov',
          relationshipToApplicantTypeId: 1,
          addressId: 1,
        },
      ],
    };

    setCharacterReferences(characterReferences);
    expect(transformedData).to.eq(expected);
  });
});

describe('setBackgroundInfo', () => {
  it('should transform the background info', () => {
    // const transformedData = {};

    const form = {
      data: {
        conviction: false,
        courtMartialed: false,
        underCharges: false,
        resignedFromEducation: false,
        withdrawnFromEducation: true,
        disciplinedForDishonesty: false,
        resignedForDishonesty: false,
        representativeForAgency: false,
        reprimandedInAgency: false,
        resignedFromAgency: false,
        appliedForVaAccreditation: true,
        terminatedByVsorg: false,
        conditionThatAffectsRepresentation: false,
        conditionThatAffectsExamination: false,
      },
    };

    const expected = {
      wasImprisoned: false,
      wasMilitaryConviction: false,
      isCurrentlyCharged: false,
      wasSuspended: false,
      hasWithdrawn: true,
      wasDisciplined: false,
      hasResignedRetired: false,
      wasAgentAttorney: false,
      wasReprimanded: false,
      hasResignedToAvoidReprimand: false,
      hasAppliedForAccreditation: true,
      wasAccreditationTerminated: false,
      hasImpairments: false,
      hasPhysicalLimitations: false,
    };

    setBackgroundInfo(form);
    expect(transformedData).to.eq(expected);
  });
});
