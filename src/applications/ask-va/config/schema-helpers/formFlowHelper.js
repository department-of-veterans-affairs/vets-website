import _ from 'lodash';
import { CHAPTER_3 } from '../../constants';

// Personal Information
import deathDatePage from '../chapters/personalInformation/deathDate';
import isTheVeteranDeceasedPage from '../chapters/personalInformation/isTheVeteranDeceased';
import searchVAMedicalCenterPage from '../chapters/personalInformation/searchVAMedicalCenter';
import vaEmployeePage from '../chapters/personalInformation/vaEmployee';
import aboutTheFamilyMemberPage from '../chapters/personalInformation/aboutTheFamilyMember';
import aboutYourRelationshipToFamilyMemberPage from '../chapters/personalInformation/relationshipToFamilyMember';
import aboutYourRelationshipPage from '../chapters/personalInformation/aboutYourRelationship';
import whoQuestionAboutPage from '../chapters/personalInformation/questionIsAbout';
import howToContactPage from '../chapters/personalInformation/howToContact';
import aboutTheVeteranPage from '../chapters/personalInformation/aboutTheVeteran';
import veteransAddressZipPage from '../chapters/personalInformation/veteranAddressZip';
import aboutYourselfPage from '../chapters/personalInformation/aboutYourself';
import yourPhoneAndEmailPage from '../chapters/personalInformation/yourPhoneAndEmail';
import yourCountryPage from '../chapters/personalInformation/yourCountry';
import yourAddressPage from '../chapters/personalInformation/yourAddress';
import addressConfirmationPage from '../chapters/personalInformation/addressConfirmation';
import yourRolePage from '../chapters/personalInformation/yourRole';
import yourPostalCodePage from '../chapters/personalInformation/yourPostalCode';

const ch3Pages = {
  yourRole: {
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRolePage.uiSchema,
    schema: yourRolePage.schema,
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
  vaEmployee: {
    title: CHAPTER_3.VA_EMPLOYEE.TITLE,
    uiSchema: vaEmployeePage.uiSchema,
    schema: vaEmployeePage.schema,
  },
  aboutYourself: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfPage.uiSchema,
    schema: aboutYourselfPage.schema,
  },
  searchVAMedicalCenter: {
    path: CHAPTER_3.VA_MED_CENTER.PATH,
    title: CHAPTER_3.VA_MED_CENTER.TITLE,
    uiSchema: searchVAMedicalCenterPage.uiSchema,
    schema: searchVAMedicalCenterPage.schema,
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
  'vaEmployee',
  'aboutYourself',
  'searchVAMedicalCenter',
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
  'vaEmployee',
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
  'vaEmployee',
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
  'vaEmployee',
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
  'vaEmployee',
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

const generalQuestion = [
  'vaEmployee',
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
