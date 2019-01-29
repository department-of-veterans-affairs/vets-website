const transformedMinimalDataActual = {
  privacyAgreementAccepted: true,
  applicantFullName: {
    first: 'testy',
    last: 'mcTestFace',
  },
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '1',
  },
  appliedForVAEducationBenefits: false,
  activeDuty: true,
  dayTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '12',
    bankAccountType: 'Checking',
    bankAccountNumber: '*********1234',
    bankRoutingNumber: '*****2115',
    bankName: 'Comerica',
  },
  dayTimePhone: '1234567890',
  nightTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
  mailingAddress: {
    street: 'MILITARY ADDY 3',
    street2: 'teasdf',
    city: 'DPO',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  vetTecProgram: [
    {
      providerName: 'prvoider',
      programName: 'program',
      courseType: 'inPerson',
      location: {
        city: 'Nowhre',
        state: 'SC',
      },
      plannedStartDate: '2019-02-02',
    },
  ],
  currentEmployment: false,
  currentHighTechnologyEmployment: true,
  currentSalary: 'moreThanSeventyFive',
  highestLevelofEducation: 'high_school_diploma_or_GED',
  activeDuty: true,
  activeDutyDuringVetTec: true,
  appliedForVAEducationBenefits: false,
  applicantFullName: {
    first: 'Greg',
    middle: 'A',
    last: 'Anderson',
  },
  applicantGender: 'M',
  dateOfBirth: '1933-04-05',
  applicantSocialSecurityNumber: '796121200',
  privacyAgreementAccepted: true,
  highTechnologyEmploymentTypes: [
    'computerProgramming',
    'dataProcessing',
    'computerSoftware',
    'informationSciences',
    'mediaApplication',
  ],
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
