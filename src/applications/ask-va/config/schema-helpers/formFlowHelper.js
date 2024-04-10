import _ from 'lodash';
import { CHAPTER_3 } from '../../constants';

// Personal Information
import aboutTheFamilyMemberPage from '../chapters/personalInformation/aboutTheFamilyMember';
import aboutTheVeteranPage from '../chapters/personalInformation/aboutTheVeteran';
import aboutYourRelationshipPage from '../chapters/personalInformation/aboutYourRelationship';
import aboutYourselfPage from '../chapters/personalInformation/aboutYourself';
import addressConfirmationPage from '../chapters/personalInformation/addressConfirmation';
import deathDatePage from '../chapters/personalInformation/deathDate';
import howToContactPage from '../chapters/personalInformation/howToContact';
import isTheVeteranDeceasedPage from '../chapters/personalInformation/isTheVeteranDeceased';
import whoQuestionAboutPage from '../chapters/personalInformation/questionIsAbout';
import aboutYourRelationshipToFamilyMemberPage from '../chapters/personalInformation/relationshipToFamilyMember';
import searchVAMedicalCenterPage from '../chapters/personalInformation/searchVAMedicalCenter';
import veteransAddressZipPage from '../chapters/personalInformation/veteranAddressZip';
import yourAddressPage from '../chapters/personalInformation/yourAddress';
import yourCountryPage from '../chapters/personalInformation/yourCountry';
import yourPhoneAndEmailPage from '../chapters/personalInformation/yourPhoneAndEmail';
import yourPostalCodePage from '../chapters/personalInformation/yourPostalCode';
import searchSchoolsPage from '../chapters/personalInformation/searchSchools';
import schoolStOrResidencyPage from '../chapters/personalInformation/schoolStOrResidency';
import stateOfSchoolPage from '../chapters/personalInformation/stateOfSchool';
import stateOrFacilityPage from '../chapters/personalInformation/stateOrFacility';
import useThisSchoolPage from '../chapters/personalInformation/useThisSchool';
import yourRolePage from '../chapters/personalInformation/yourRole';
import yourRoleEducationPage from '../chapters/personalInformation/yourRoleEducation';

const ch3Pages = {
  yourRole: {
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRolePage.uiSchema,
    schema: yourRolePage.schema,
  },
  yourRoleEducation: {
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRoleEducationPage.uiSchema,
    schema: yourRoleEducationPage.schema,
  },
  aboutYourRelationship: {
    title: CHAPTER_3.ABOUT_YOUR_RELATIONSHIP.TITLE,
    uiSchema: aboutYourRelationshipPage.uiSchema,
    schema: aboutYourRelationshipPage.schema,
    depends: form => form.personalRelationship !== 'VETERAN',
  },
  aboutTheVeteran: {
    title: CHAPTER_3.ABOUT_THE_VET.TITLE,
    uiSchema: aboutTheVeteranPage.uiSchema,
    schema: aboutTheVeteranPage.schema,
  },
  veteranDeceased: {
    title: CHAPTER_3.VET_DECEASED.TITLE,
    uiSchema: isTheVeteranDeceasedPage.uiSchema,
    schema: isTheVeteranDeceasedPage.schema,
  },
  dateOfDeath: {
    title: CHAPTER_3.DEATH_DATE.TITLE,
    uiSchema: deathDatePage.uiSchema,
    schema: deathDatePage.schema,
    depends: form => form.isVeteranDeceased === 'YES',
  },
  veteransAddressZip: {
    title: CHAPTER_3.VET_POSTAL_CODE.TITLE,
    uiSchema: veteransAddressZipPage.uiSchema,
    schema: veteransAddressZipPage.schema,
  },
  yourPostalCode: {
    title: CHAPTER_3.YOUR_POSTAL_CODE.TITLE,
    uiSchema: yourPostalCodePage.uiSchema,
    schema: yourPostalCodePage.schema,
    depends: form => form.contactPreference !== 'US_MAIL',
  },
  whoThisIsAbout: {
    title: CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE,
    uiSchema: whoQuestionAboutPage.uiSchema,
    schema: whoQuestionAboutPage.schema,
  },
  aboutYourself: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfPage.uiSchema,
    schema: aboutYourselfPage.schema,
  },
  searchVAMedicalCenter: {
    title: CHAPTER_3.VA_MED_CENTER.TITLE,
    uiSchema: searchVAMedicalCenterPage.uiSchema,
    schema: searchVAMedicalCenterPage.schema,
  },
  searchSchools: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: searchSchoolsPage.uiSchema,
    schema: searchSchoolsPage.schema,
  },
  schoolStOrResidency: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: schoolStOrResidencyPage.uiSchema,
    schema: schoolStOrResidencyPage.schema,
  },
  stateOfSchool: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: stateOfSchoolPage.uiSchema,
    schema: stateOfSchoolPage.schema,
  },
  stateOrFacility: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: stateOrFacilityPage.uiSchema,
    schema: stateOrFacilityPage.schema,
  },
  useThisSchool: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: useThisSchoolPage.uiSchema,
    schema: useThisSchoolPage.schema,
  },
  yourPhoneAndEmail: {
    title: CHAPTER_3.PHONE_EMAIL.TITLE,
    uiSchema: yourPhoneAndEmailPage.uiSchema,
    schema: yourPhoneAndEmailPage.schema,
  },
  howToContact: {
    title: CHAPTER_3.CONTACT_PREF.TITLE,
    uiSchema: howToContactPage.uiSchema,
    schema: howToContactPage.schema,
  },
  yourCountry: {
    title: CHAPTER_3.YOUR_COUNTRY.TITLE,
    uiSchema: yourCountryPage.uiSchema,
    schema: yourCountryPage.schema,
    depends: form => form.contactPreference === 'US_MAIL',
  },
  yourAddress: {
    title: CHAPTER_3.YOUR_ADDRESS.TITLE,
    uiSchema: yourAddressPage.uiSchema,
    schema: yourAddressPage.schema,
    depends: form => form.contactPreference === 'US_MAIL',
  },
  yourAddressConfirmation: {
    title: CHAPTER_3.ADDRESS_CONFIRM.TITLE,
    uiSchema: addressConfirmationPage.uiSchema,
    schema: addressConfirmationPage.schema,
    depends: form =>
      !form.onBaseOutsideUS && form.contactPreference === 'US_MAIL',
  },
  aboutYourFamilyMember: {
    title: CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE,
    uiSchema: aboutTheFamilyMemberPage.uiSchema,
    schema: aboutTheFamilyMemberPage.schema,
  },
  aboutYourRelationshipToFamilyMember: {
    title: CHAPTER_3.RELATIONSHIP_TO_FAM_MEM.TITLE,
    uiSchema: aboutYourRelationshipToFamilyMemberPage.uiSchema,
    schema: aboutYourRelationshipToFamilyMemberPage.schema,
  },
};

export const flowPaths = {
  myOwnBenVet: 'veteran-my-benefits',
  myOwnBenFam: 'family-my-benefits',
  someoneElseBenVet: 'veteran-someones-benefits',
  someoneElseBenFam: 'family-someones-benefits',
  someoneElseBen3rdParty: 'third-party-someones-benefits',
  someoneElseBen3rdPartyEducation: 'third-party-someones-benefits-education',
  general: 'general-question',
};

export const flowPages = (obj, list, path) => {
  const pages = _.cloneDeep(obj);
  const flowGroup = {};
  list.forEach((page, index) => {
    const key = `${page}_${path.split('-').join('')}`;
    flowGroup[key] = pages[page];
    flowGroup[key].path = `${path}-${index + 1}`;

    if (list.length === index + 1) {
      flowGroup[key].onNavForward = ({ goPath }) =>
        goPath('/review-then-submit');
    }

    if (index === 0) {
      flowGroup[key].onNavBack = ({ goPath }) => goPath('/question-3');
    }
  });

  return flowGroup;
};

// Form flows
const myOwnBenVet = [
  'aboutYourself',
  'searchVAMedicalCenter',
  'searchSchools',
  'schoolStOrResidency',
  'stateOrFacility',
  'stateOfSchool',
  'useThisSchool',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
  'yourPostalCode',
];
export const myOwnBenVetPages = flowPages(
  ch3Pages,
  myOwnBenVet,
  flowPaths.myOwnBenVet,
);

const myOwnBenFam = [
  'aboutYourRelationship',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransAddressZip',
  'aboutYourself',
  'searchVAMedicalCenter',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
];
export const myOwnBenFamPages = flowPages(
  ch3Pages,
  myOwnBenFam,
  flowPaths.myOwnBenFam,
);

const someoneElseBenVet = [
  'aboutYourself',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
  'yourPostalCode',
  'aboutYourFamilyMember',
  'aboutYourRelationshipToFamilyMember',
  'searchVAMedicalCenter',
];
export const someoneElseBenVetPages = flowPages(
  ch3Pages,
  someoneElseBenVet,
  flowPaths.someoneElseBenVet,
);

const someoneElseBenFam = [
  'aboutYourRelationship',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransAddressZip',
  'whoThisIsAbout',
  'searchVAMedicalCenter',
  'aboutYourFamilyMember',
  'aboutYourRelationshipToFamilyMember',
  'yourPhoneAndEmail',
  'searchVAMedicalCenter',
  'aboutYourself',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
  'aboutYourFamilyMember',
];
export const someoneElseBenFamPages = flowPages(
  ch3Pages,
  someoneElseBenFam,
  flowPaths.someoneElseBenFam,
);
someoneElseBenFamPages.searchVAMedicalCenter_familysomeonesbenefits.onNavForward = ({
  formData,
  goPath,
}) => {
  if (formData.whoQuestionAbout === 'ABOUT_VETERAN') {
    goPath('/review-then-submit');
  } else {
    goPath(`${flowPaths.someoneElseBenFam}-19`);
  }
};

const someoneElseBen3rdParty = [
  'yourRole',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransAddressZip',
  'searchVAMedicalCenter',
  'aboutYourself',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
];
export const someoneElseBen3rdPartyPages = flowPages(
  ch3Pages,
  someoneElseBen3rdParty,
  flowPaths.someoneElseBen3rdParty,
);

const someoneElseBen3rdPartyEducation = [
  'yourRoleEducation',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransAddressZip',
  'searchVAMedicalCenter',
  'aboutYourself',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
];
export const someoneElseBen3rdPartyEducationPages = flowPages(
  ch3Pages,
  someoneElseBen3rdPartyEducation,
  flowPaths.someoneElseBen3rdPartyEducation,
);

const generalQuestion = [
  'aboutYourself',
  'searchVAMedicalCenter',
  'yourPhoneAndEmail',
  'howToContact',
  'yourCountry',
  'yourAddress',
  'yourAddressConfirmation',
  'yourPostalCode',
];
export const generalQuestionPages = flowPages(
  ch3Pages,
  generalQuestion,
  flowPaths.general,
);

generalQuestionPages.yourAddressConfirmation_generalquestion.onNavForward = ({
  goPath,
}) => goPath('/review-then-submit');

generalQuestionPages.yourAddress_generalquestion.onNavForward = ({
  formData,
  goPath,
}) => {
  if (formData.onBaseOutsideUS) {
    goPath('/review-then-submit');
  } else {
    goPath(`${flowPaths.general}-8`);
  }
};
