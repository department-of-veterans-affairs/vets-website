import _ from 'lodash';
import { CHAPTER_2, CHAPTER_3 } from '../../constants';

// Personal Information
import aboutTheFamilyMemberPage from '../chapters/personalInformation/aboutTheFamilyMember';
import aboutTheVeteranPage from '../chapters/personalInformation/aboutTheVeteran';
import aboutYourselfPage from '../chapters/personalInformation/aboutYourself';
import aboutYourselfGeneralPage from '../chapters/personalInformation/aboutYourselfGeneral';
import aboutYourselfRelationshipFamilyMemberPage from '../chapters/personalInformation/aboutYourselfRelationshipFamilyMember';
import addressValidationPage from '../chapters/personalInformation/addressValidation';
import deathDatePage from '../chapters/personalInformation/deathDate';
import familyMembersLocationOfResidencePage from '../chapters/personalInformation/familyMembersLocationOfResidence';
import familyMembersPostalCodePage from '../chapters/personalInformation/familyMembersPostalCode';
import isTheVeteranDeceasedPage from '../chapters/personalInformation/isTheVeteranDeceased';
import moreAboutYourRelationshipToVeteranPage from '../chapters/personalInformation/moreAboutYourRelationshipToVeteran';
import whoQuestionAboutPage from '../chapters/personalInformation/questionIsAbout';
import aboutYourRelationshipToFamilyMemberPage from '../chapters/personalInformation/relationshipToFamilyMember';
import schoolStOrResidencyPage from '../chapters/personalInformation/schoolStOrResidency';
import searchSchoolsPage from '../chapters/personalInformation/searchSchools';
import searchVAMedicalCenterPage from '../chapters/personalInformation/searchVAMedicalCenter';
import stateOfSchoolPage from '../chapters/personalInformation/stateOfSchool';
import stateOrFacilityPage from '../chapters/personalInformation/stateOrFacility';
import theirRelationshipToVeteranPage from '../chapters/personalInformation/theirRelationshipToVeteran';
import useThisSchoolPage from '../chapters/personalInformation/useThisSchool';
import veteransLocationOfResidencePage from '../chapters/personalInformation/veteransLocationOfResidence';
import veteransPostalCodePage from '../chapters/personalInformation/veteransPostalCode';
import yourContactInformationPage from '../chapters/personalInformation/yourContactInformation';
import yourCountryPage from '../chapters/personalInformation/yourCountry';
import yourLocationOfResidencePage from '../chapters/personalInformation/yourLocationOfResidence';
import yourMailingAddressPage from '../chapters/personalInformation/yourMailingAddress';
import yourPostalCodePage from '../chapters/personalInformation/yourPostalCode';
import yourRolePage from '../chapters/personalInformation/yourRole';
import yourRoleEducationPage from '../chapters/personalInformation/yourRoleEducation';

export const flowPaths = {
  aboutMyselfRelationshipVeteran: 'about-myself-relationship-veteran',
  aboutMyselfRelationshipFamilyMember:
    'about-myself-relationship-family-member',
  aboutSomeoneElseRelationshipVeteran:
    'about-someone-else-relationship-veteran',
  aboutSomeoneElseRelationshipFamilyMember:
    'about-someone-else-relationship-family-member',
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteran:
    'about-someone-else-relationship-family-member-about-veteran',
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember:
    'about-someone-else-relationship-family-member-about-family-member',
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation:
    'about-someone-else-relationship-veteran-or-family-member-education',
  aboutSomeoneElseRelationshipConnectedThroughWork:
    'about-someone-else-relationship-connected-through-work',
  aboutSomeoneElseRelationshipConnectedThroughWorkEducation:
    'about-someone-else-relationship-connected-through-work-education',
  general: 'general-question',
};

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
  moreAboutYourRelationshipToVeteran: {
    title: CHAPTER_3.MORE_ABOUT_YOUR_RELATIONSHIP_TO_VETERAN.TITLE,
    uiSchema: moreAboutYourRelationshipToVeteranPage.uiSchema,
    schema: moreAboutYourRelationshipToVeteranPage.schema,
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
  veteransPostalCode: {
    title: CHAPTER_3.VETERANS_POSTAL_CODE.TITLE,
    uiSchema: veteransPostalCodePage.uiSchema,
    schema: veteransPostalCodePage.schema,
  },
  veteransLocationOfResidence: {
    title: CHAPTER_3.VETERAN_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: veteransLocationOfResidencePage.uiSchema,
    schema: veteransLocationOfResidencePage.schema,
  },
  familyMembersPostalCode: {
    title: CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.TITLE,
    uiSchema: familyMembersPostalCodePage.uiSchema,
    schema: familyMembersPostalCodePage.schema,
  },
  yourPostalCode: {
    title: CHAPTER_3.YOUR_POSTAL_CODE.TITLE,
    uiSchema: yourPostalCodePage.uiSchema,
    schema: yourPostalCodePage.schema,
    depends: form => form.contactPreference !== 'US_MAIL',
  },
  isQuestionAboutVeteranOrSomeoneElse: {
    title: CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE,
    uiSchema: whoQuestionAboutPage.uiSchema,
    schema: whoQuestionAboutPage.schema,
    onNavForward: ({ formData, goPath }) => {
      if (formData.whoQuestionAbout === 'VETERAN') {
        goPath(
          `/${
            flowPaths.aboutSomeoneElseRelationshipFamilyMemberAboutVeteran
          }-1`,
        );
      } else {
        goPath(
          `/${
            flowPaths.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember
          }-1`,
        );
      }
    },
  },
  aboutYourself: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfPage.uiSchema,
    schema: aboutYourselfPage.schema,
    // depends: () => hasSession(),
  },
  aboutYourselfGeneral: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfGeneralPage.uiSchema,
    schema: aboutYourselfGeneralPage.schema,
    // depends: () => hasSession(),
  },
  aboutYourselfRelationshipFamilyMember: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfRelationshipFamilyMemberPage.uiSchema,
    schema: aboutYourselfRelationshipFamilyMemberPage.schema,
    // depends: () => hasSession(),
  },
  searchVAMedicalCenter: {
    title: CHAPTER_3.VA_MED_CENTER.TITLE,
    uiSchema: searchVAMedicalCenterPage.uiSchema,
    schema: searchVAMedicalCenterPage.schema,
    depends: form =>
      form.selectCategory === 'VA Health Care' &&
      (form.selectTopic === 'Medical Care Concerns at a VA Medical Facility' ||
        form.selectTopic === 'VHA Audiology & Hearing Aids'),
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
  yourContactInformation: {
    title: CHAPTER_3.CONTACT_INFORMATION.TITLE,
    uiSchema: yourContactInformationPage.uiSchema,
    schema: yourContactInformationPage.schema,
  },
  yourCountry: {
    title: CHAPTER_3.YOUR_COUNTRY.TITLE,
    uiSchema: yourCountryPage.uiSchema,
    schema: yourCountryPage.schema,
    depends: form => form.contactPreference === 'US_MAIL',
  },
  yourMailingAddress: {
    title: CHAPTER_3.YOUR_MAILING_ADDRESS.TITLE,
    uiSchema: yourMailingAddressPage.uiSchema,
    schema: yourMailingAddressPage.schema,
    depends: form => form.contactPreference === 'US_MAIL',
  },
  addressValidation: {
    title: CHAPTER_3.ADDRESS_CONFIRM.TITLE,
    uiSchema: addressValidationPage.uiSchema,
    schema: addressValidationPage.schema,
    depends: form => form.contactPreference === 'US_MAIL',
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
  theirRelationshipToVeteran: {
    title: CHAPTER_3.RELATIONSHIP_TO_FAM_MEM.TITLE,
    uiSchema: theirRelationshipToVeteranPage.uiSchema,
    schema: theirRelationshipToVeteranPage.schema,
  },
  familyMembersLocationOfResidence: {
    title: CHAPTER_3.FAMILY_MEMBERS_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: familyMembersLocationOfResidencePage.uiSchema,
    schema: familyMembersLocationOfResidencePage.schema,
  },
  yourLocationOfResidence: {
    title: CHAPTER_3.YOUR_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: yourLocationOfResidencePage.uiSchema,
    schema: yourLocationOfResidencePage.schema,
  },
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
        goPath(CHAPTER_2.PAGE_3.PATH);
    }

    if (index === 0) {
      flowGroup[key].onNavBack = ({ goPath }) =>
        goPath('/who-is-your-question-about');
    }
  });
  return flowGroup;
};

// Form flows
const aboutMyselfRelationshipVeteran = [
  'aboutYourself',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
  'yourLocationOfResidence',
  'yourPostalCode',
];
export const aboutMyselfRelationshipVeteranPages = flowPages(
  ch3Pages,
  aboutMyselfRelationshipVeteran,
  flowPaths.aboutMyselfRelationshipVeteran,
);

const aboutMyselfRelationshipFamilyMember = [
  'moreAboutYourRelationshipToVeteran',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'aboutYourselfRelationshipFamilyMember',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
  'yourLocationOfResidence',
  'yourPostalCode',
];
export const aboutMyselfRelationshipFamilyMemberPages = flowPages(
  ch3Pages,
  aboutMyselfRelationshipFamilyMember,
  flowPaths.aboutMyselfRelationshipFamilyMember,
);

const aboutSomeoneElseRelationshipVeteran = [
  'aboutYourRelationshipToFamilyMember',
  'aboutYourFamilyMember',
  'familyMembersLocationOfResidence',
  'familyMembersPostalCode',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'aboutYourself',
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
];
export const aboutSomeoneElseRelationshipVeteranPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipVeteran,
  flowPaths.aboutSomeoneElseRelationshipVeteran,
);

const aboutSomeoneElseRelationshipFamilyMember = [
  'isQuestionAboutVeteranOrSomeoneElse',
  'aboutTheVeteran', // Needed for list, should not render
];
export const aboutSomeoneElseRelationshipFamilyMemberPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipFamilyMember,
  flowPaths.aboutSomeoneElseRelationshipFamilyMember,
);

const aboutSomeoneElseRelationshipFamilyMemberAboutVeteran = [
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransLocationOfResidence',
  'veteransPostalCode',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'aboutYourselfRelationshipFamilyMember',
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
];
export const aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteran,
  flowPaths.aboutSomeoneElseRelationshipFamilyMemberAboutVeteran,
);

const aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember = [
  'theirRelationshipToVeteran',
  'aboutYourFamilyMember',
  'familyMembersLocationOfResidence',
  'familyMembersPostalCode',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
];
export const aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember,
  flowPaths.aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMember,
);

const aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation = [
  'schoolStOrResidency',
  'aboutYourself',
  'yourContactInformation',
];
export const aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation,
  flowPaths.aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducation,
);

const aboutSomeoneElseRelationshipConnectedThroughWork = [
  'yourRole',
  'aboutTheVeteran',
  'veteranDeceased',
  'dateOfDeath',
  'veteransLocationOfResidence',
  'veteransPostalCode',
  'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'aboutYourself',
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
];
export const aboutSomeoneElseRelationshipConnectedThroughWorkPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipConnectedThroughWork,
  flowPaths.aboutSomeoneElseRelationshipConnectedThroughWork,
);

const aboutSomeoneElseRelationshipConnectedThroughWorkEducation = [
  'yourRole',
  'searchSchools',
  'aboutYourself',
  'yourContactInformation',
];
export const aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducation,
  flowPaths.aboutSomeoneElseRelationshipConnectedThroughWorkEducation,
);

const generalQuestion = [
  'aboutYourselfGeneral',
  // 'searchVAMedicalCenter',
  // Veteran Readiness & Employment Info #986 - not needed for research, needed before handover to CRM
  'yourContactInformation',
  'yourMailingAddress',
  'addressValidation',
  'yourLocationOfResidence',
  'yourPostalCode',
];
export const generalQuestionPages = flowPages(
  ch3Pages,
  generalQuestion,
  flowPaths.general,
);
