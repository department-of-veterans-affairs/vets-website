const transformedMinimalDataActual = {
  state: 'Virginia',
  country: 'United States',
  contactInfo: {
    email: 'janedoe@gmail.com',
  },
  veteranDesc: "I'm a Veteran",
  veteranFullName: {
    first: 'Jane',
    last: 'Doe',
  },
  highestLevelOfEducation: {},
  signature: 'Jane Doe',
  AGREED: true,
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  techIndustryFocusArea: 'Computer software',
  isWorkingInTechIndustry: 'Yes',
  currentAnnualSalary: 'Between $35,001 and $50,000',
  currentlyEmployed: 'Yes',
  highestLevelOfEducation: {
    level: "A bachelor's degree",
  },
  raceAndGender: 'Yes',
  ethnicity: 'Prefer not to answer',
  orginRace: { noAnswer: true },
  state: 'Texas',
  country: 'United States',
  contactInfo: {
    email: 'janedoe@gmail.com',
    mobilePhone: '4442341242',
    homePhone: '3434232434',
  },
  veteranDesc: 'veteransChild',
  veteranFullName: {
    first: 'Jane',
    middle: 'Test',
    last: 'Doe',
  },
  signature: 'Jane Doe',
  AGREED: true,
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
