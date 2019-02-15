const transformedMinimalDataActual = {
  privacyAgreementAccepted: true,
  applicantFullName: {
    first: 'testy',
    last: 'mcTestFace',
  },
  appliedForVaEducationBenefits: false,
  activeDuty: true,
  dayTimePhone: '1234567890',
  emailAddress: 'test2@test1.net',
  mailingAddress: {
    street: 'MILITARY ADDY 3',
    city: 'Nowhere',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  prefillBankAccount: {
    bankAccountType: 'checking',
    bankAccountNumber: '*********1234',
    bankRoutingNumber: '*****2115',
    bankName: 'Comerica',
  },
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '12',
  },
  dayTimePhone: '1234567890',
  nightTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
  mailingAddress: {
    street: 'MILITARY ADDY 3',
    street2: 'teasdf',
    street3: 'teasdf',
    city: 'Nowhere',
    country: 'USA',
    state: 'MI',
    postalCode: '22312',
  },
  vetTecPrograms: [
    {
      providerName: 'Amazon Web Services',
      programName: 'AWS Media Services',
      courseType: 'inPerson',
      plannedStartDate: '2010-01-02',
      location: {
        city: 'Nowhere',
        state: 'SC',
      },
    },
    {
      providerName: 'Amazon Web Services',
      programName: 'AWS Media Services',
      courseType: 'online',
      plannedStartDate: '2010-01-02',
    },
  ],
  currentHighTechnologyEmployment: false,
  pastHighTechnologyEmployment: true,
  currentSalary: 'moreThanSeventyFive',
  highestLevelofEducation: 'other',
  otherEducation: 'other ed',
  activeDuty: true,
  activeDutyDuringVetTec: true,
  appliedForVaEducationBenefits: false,
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
