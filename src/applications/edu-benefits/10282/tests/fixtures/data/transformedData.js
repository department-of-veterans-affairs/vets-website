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
  gender: 'W',
  originRace: { noAnswer: true },
  state: 'TX',
  country: 'United States',
  contactInfo: {
    email: 'janedoe@gmail.com',
    mobilePhone: '+1 4442341242 (US)',
    homePhone: '+1 3434232434 (US)',
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
