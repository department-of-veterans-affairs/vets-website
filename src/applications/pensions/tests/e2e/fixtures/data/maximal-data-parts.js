export const chapter12 = {
  veteranFullName: {
    first: 'John',
    middle: 'Edmund',
    last: 'Doe',
    suffix: 'Sr.',
  },
  veteranSocialSecurityNumber: '333224444',
  vaFileNumber: '12345678',
  veteranDateOfBirth: '1960-01-01',
  veteranAddress: {
    street: '123 8th st',
    street2: 'A-3',
    city: 'Hadley',
    country: 'USA',
    state: 'ME',
    postalCode: '01050',
    isMilitary: false,
  },
  email: 'test@example.com',
  phone: '5551234567',
  mobilePhone: '5551234567',
  internationalPhone: '001-555-123-4567',
  serviceBranch: {
    army: true,
    navy: true,
  },
  activeServiceDateRange: {
    from: '2003-03-02',
    to: '2007-03-20',
  },
  serviceNumber: '123456',
  placeOfSeparation: 'West Brookfield, MA',

  serveUnderOtherNames: true,
  'view:isAddingOtherNames': false,
  previousNames: [
    {
      previousFullName: {
        first: 'Joseph',
        last: 'Doe',
      },
    },
  ],
  powStatus: true,
  powDateRange: {
    from: '1971-02-26',
    to: '1973-03-02',
  },
};

export const chapter3 = {
  isOver65: false,
  socialSecurityDisability: false,
  medicalCondition: false,
  nursingHome: true,
  medicaidCoverage: false,
  medicaidStatus: true,
  specialMonthlyPension: false,
  vaTreatmentHistory: true,
  'view:isAddingVaMedicalCenters': false,
  vaMedicalCenters: [
    {
      medicalCenter: 'Dallas VA Medical Center',
    },
  ],
  federalTreatmentHistory: true,
  'view:isAddingFederalMedicalCenters': false,
  federalMedicalCenters: [
    {
      medicalCenter: 'Memphis Health Care',
    },
  ],
  currentEmployment: true,
  'view:isAddingCurrentEmployment': false,
  currentEmployers: [
    {
      jobType: 'Customer service',
      jobHoursWeek: '20',
    },
  ],
};

export const chapter4 = {
  maritalStatus: 'SEPARATED',
  marriages: [
    {
      spouseFullName: {
        first: 'Jessica',
        middle: 'Middle',
        last: 'Doe',
      },
      'view:pastMarriage': {
        reasonForSeparation: 'OTHER',
        otherExplanation: 'Other reason',
        dateOfMarriage: '1989-03-02',
        dateOfSeparation: '1990-03-02',
        locationOfMarriage: 'Dallas',
        locationOfSeparation: 'San Antonio, TX',
      },
    },
    {
      spouseFullName: {
        first: 'Jane',
        middle: 'Middle',
        last: 'Doe',
      },
      'view:pastMarriage': {
        reasonForSeparation: 'DEATH',
        dateOfMarriage: '1989-03-02',
        dateOfSeparation: '1990-03-02',
        locationOfMarriage: 'Dallas',
        locationOfSeparation: 'San Antonio, TX',
      },
    },
    {
      spouseFullName: {
        first: 'Meg',
        middle: 'Middle',
        last: 'Doe',
      },
      'view:currentMarriage': {
        dateOfMarriage: '1994-03-02',
        locationOfMarriage: 'North Adams, MA',
        marriageType: 'OTHER',
        otherExplanation: 'Other reason',
      },
    },
  ],
  spouseDateOfBirth: '1960-01-01',
  spouseSocialSecurityNumber: '333224444',
  spouseIsVeteran: true,
  spouseVaFileNumber: '23423444',
  'view:liveWithSpouse': false,
  reasonForCurrentSeparation: 'OTHER',
  otherExplanation: 'Personal reason',
  spouseAddress: {
    street: '123 7th st',
    street2: 'Apt 3',
    city: 'Pittsfield',
    country: 'USA',
    state: 'MA',
    postalCode: '01050',
  },
  currentSpouseMonthlySupport: 2444,
  currentSpouseMaritalHistory: 'YES',
  spouseMarriages: [
    {
      dateOfMarriage: '1980-03-02',
      locationOfMarriage: 'Seattle, WA',
      spouseFullName: {
        first: 'Joe',
        middle: 'F',
        last: 'Generic',
        suffix: 'Jr.',
      },
      reasonForSeparation: 'DEATH',
      dateOfSeparation: '1990-03-02',
      locationOfSeparation: 'Tacoma, WA',
    },
    {
      dateOfMarriage: '1995-03-02',
      locationOfMarriage: 'Seattle, WA',
      spouseFullName: {
        first: 'John',
        middle: 'F',
        last: 'Person',
        suffix: 'Jr.',
      },
      reasonForSeparation: 'OTHER',
      otherExplanation: 'Other reason',
      dateOfSeparation: '2005-03-02',
      locationOfSeparation: 'Tacoma, WA',
    },
  ],
  'view:hasDependents': true,
  'view:isAddingDependents': false,
  dependents: [
    {
      childInHousehold: false,
      childAddress: {
        street: '123 8th st',
        city: 'Hadley',
        country: 'USA',
        state: 'ME',
        postalCode: '01050',
      },
      personWhoLivesWithChild: {
        first: 'Joe',
        middle: 'Middle',
        last: 'Smith',
      },
      monthlyPayment: 3444,
      childPlaceOfBirth: 'Tallahassee, FL',
      childSocialSecurityNumber: '333224444',
      childRelationship: 'BIOLOGICAL',
      disabled: false,
      previouslyMarried: true,
      married: true,
      fullName: {
        first: 'Emily',
        middle: 'Anne',
        last: 'Doe',
      },
      childDateOfBirth: '2000-03-03',
    },
    {
      childInHousehold: true,
      childPlaceOfBirth: 'Troy, MT',
      childSocialSecurityNumber: '333224444',
      childRelationship: 'ADOPTED',
      previouslyMarried: false,
      disabled: false,
      attendingCollege: true,
      fullName: {
        first: 'Bobby',
        middle: 'Nolan',
        last: 'Doe',
      },
      childDateOfBirth: '2005-09-22',
    },
    {
      childInHousehold: true,
      childAddress: {
        street: '123 8th st',
        city: 'Hadley',
        country: 'USA',
        state: 'ME',
        postalCode: '01050',
      },
      monthlyPayment: 2300,
      childPlaceOfBirth: 'Troy, MT',
      childSocialSecurityNumber: '333224444',
      childRelationship: 'BIOLOGICAL',
      previouslyMarried: false,
      disabled: true,
      fullName: {
        first: 'Jack',
        middle: 'Sawyer',
        last: 'Doe',
      },
      childDateOfBirth: '2010-04-01',
    },
  ],
};

export const chapter5 = {
  totalNetWorth: false,
  netWorthEstimation: 1550,
  transferredAssets: true,
  homeOwnership: true,
  homeAcreageMoreThanTwo: true,
  homeAcreageValue: 75000,
  landMarketable: true,

  receivesIncome: true,
  'view:isAddingIncomeSources': false,
  incomeSources: [
    {
      typeOfIncome: 'SOCIAL_SECURITY',
      receiver: 'DEPENDENT',
      dependentName: 'Bobby Doe',
      payer: 'John Doe',
      amount: 278.05,
    },
    {
      typeOfIncome: 'INTEREST_DIVIDEND',
      receiver: 'VETERAN',
      payer: 'John Doe',
      amount: 78.5,
    },
    {
      typeOfIncome: 'OTHER',
      otherTypeExplanation: 'part-time Uber',
      receiver: 'SPOUSE',
      payer: 'John Doe',
      amount: 278.99,
    },
    {
      typeOfIncome: 'OTHER',
      otherTypeExplanation: 'full time job',
      receiver: 'VETERAN',
      payer: 'John Doe',
      amount: 3278.75,
    },
  ],

  hasCareExpenses: true,
  'view:isAddingCareExpenses': false,
  careExpenses: [
    {
      recipients: 'VETERAN',
      provider: 'NYC Care Provider',
      careType: 'CARE_FACILITY',
      ratePerHour: 100,
      hoursPerWeek: '20',
      careDateRange: {
        from: '2020-08-01',
        to: '2023-05-25',
      },
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 2500,
    },
    {
      recipients: 'SPOUSE',
      provider: 'MA Care Provider',
      careType: 'IN_HOME_CARE_PROVIDER',
      ratePerHour: 150,
      hoursPerWeek: '15',
      careDateRange: {
        from: '2021-08-01',
        to: '2022-05-25',
      },
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 1500,
    },
    {
      recipients: 'DEPENDENT',
      childName: 'Joe Doe',
      provider: 'LA Care Provider',
      careType: 'CARE_FACILITY',
      ratePerHour: 200,
      hoursPerWeek: '10',
      careDateRange: {
        from: '2020-08-01',
      },
      noCareEndDate: true,
      paymentFrequency: 'ONCE_YEAR',
      paymentAmount: 22500,
    },
  ],

  hasMedicalExpenses: true,
  'view:isAddingMedicalExpenses': false,
  medicalExpenses: [
    {
      recipients: 'VETERAN',
      provider: 'Funeral Home',
      purpose: 'Burial expenses',
      paymentDate: '2020-03-15',
      paymentFrequency: 'ONE_TIME',
      paymentAmount: 10000,
    },
    {
      recipients: 'DEPENDENT',
      childName: 'Joe Doe',
      provider: 'Health Provider',
      purpose: 'Medical expenses',
      paymentDate: '2023-07-01',
      paymentFrequency: 'ONE_TIME',
      paymentAmount: 10000,
    },
    {
      recipients: 'SPOUSE',
      provider: 'Health Provider',
      purpose: 'Medical expenses',
      paymentDate: '2023-07-01',
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 500,
    },
    {
      recipients: 'DEPENDENT',
      childName: 'Joe Doe',
      provider: 'Health Provider',
      purpose: 'Medical expenses',
      paymentDate: '2023-07-01',
      paymentFrequency: 'ONCE_YEAR',
      paymentAmount: 5000,
    },
    {
      recipients: 'SPOUSE',
      provider: 'Health Provider',
      purpose: 'Medical expenses',
      paymentDate: '2023-07-01',
      paymentFrequency: 'ONCE_MONTH',
      paymentAmount: 200,
    },
    {
      recipients: 'DEPENDENT',
      childName: 'Joe Doe',
      provider: 'Health Provider',
      purpose: 'Medical fee',
      paymentDate: '2023-07-01',
      paymentFrequency: 'ONE_TIME',
      paymentAmount: 100,
    },
  ],
};

export const chapter6 = {
  'view:usingDirectDeposit': true,
  bankAccount: {
    accountType: 'checking',
    bankName: 'Best Bank',
    accountNumber: '001122334455',
    routingNumber: '123123123',
  },
  noRapidProcessing: true,
};

export const chapter7 = {
  statementOfTruthCertified: true,
  statementOfTruthSignature: 'John Edmund Doe',
};
