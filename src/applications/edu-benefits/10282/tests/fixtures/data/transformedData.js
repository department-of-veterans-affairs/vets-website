const transformedMinimalDataActual = {
  state: 'VA',
  country: 'United States',
  contactInfo: {
    email: 'janedoe@gmail.com',
  },
  veteranDesc: 'veteran',
  veteranFullName: {
    first: 'Jane',
    last: 'Doe',
  },
  highestLevelOfEducation: {},
};

export const transformedMinimalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMinimalDataActual),
  },
});

const transformedMaximalDataActual = {
  techIndustryFocusArea: 'CS',
  isWorkingInTechIndustry: true,
  currentAnnualSalary: 'thirtyFiveToFifty',
  currentlyEmployed: true,
  highestLevelOfEducation: {
    level: 'BD',
  },
  raceAndGender: true,
  ethnicity: 'NA',
  gender: 'NA',
  originRace: { noAnswer: true },
  state: 'TX',
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
};

export const transformedMaximalData = JSON.stringify({
  educationBenefitsClaim: {
    form: JSON.stringify(transformedMaximalDataActual),
  },
});
