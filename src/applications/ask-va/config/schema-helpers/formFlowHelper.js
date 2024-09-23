import _ from 'lodash';
import {
  CategoryEducation,
  CHAPTER_2,
  CHAPTER_3,
  healthcareCategoryLabels,
  schoolInYourProfileOptions,
  yourRoleOptions,
} from '../../constants';

// Personal Information
import CustomPageReviewField from '../../components/CustomPageReviewField';
import YourVAHealthFacilityPage from '../../containers/YourVAHealthFacility';
import aboutTheFamilyMemberPage from '../chapters/personalInformation/aboutTheFamilyMember';
import aboutTheVeteranPage from '../chapters/personalInformation/aboutTheVeteran';
import aboutYourselfPage from '../chapters/personalInformation/aboutYourself';
import aboutYourselfGeneralPage from '../chapters/personalInformation/aboutYourselfGeneral';
import aboutYourselfRelationshipFamilyMemberPage from '../chapters/personalInformation/aboutYourselfRelationshipFamilyMember';
import addressValidationPage from '../chapters/personalInformation/addressValidation';
import deathDatePage from '../chapters/personalInformation/deathDate';
import familyMembersLocationOfResidencePage from '../chapters/personalInformation/familyMembersLocationOfResidence';
import familyMembersPostalCodePage from '../chapters/personalInformation/familyMembersPostalCode';
import isQuestionAboutVeteranOrSomeoneElsePage from '../chapters/personalInformation/isQuestionAboutVeteranOrSomeoneElse';
import isTheVeteranDeceasedPage from '../chapters/personalInformation/isTheVeteranDeceased';
import moreAboutYourRelationshipToVeteranPage from '../chapters/personalInformation/moreAboutYourRelationshipToVeteran';
import aboutYourRelationshipToFamilyMemberPage from '../chapters/personalInformation/relationshipToFamilyMember';
import relationshipToVeteranPage from '../chapters/personalInformation/relationshipToVeteran';
import schoolStOrResidencyPage from '../chapters/personalInformation/schoolStOrResidency';
import searchSchoolsPage from '../chapters/personalInformation/searchSchools';
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
import schoolInYourProfilePage from '../chapters/personalInformation/schoolInYourProfile';

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
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRolePage.uiSchema,
    schema: yourRolePage.schema,
  },
  yourRoleEducation: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRoleEducationPage.uiSchema,
    schema: yourRoleEducationPage.schema,
  },
  moreAboutYourRelationshipToVeteran: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.MORE_ABOUT_YOUR_RELATIONSHIP_TO_VETERAN.TITLE,
    uiSchema: moreAboutYourRelationshipToVeteranPage.uiSchema,
    schema: moreAboutYourRelationshipToVeteranPage.schema,
    CustomPageReview: CustomPageReviewField,
    depends: form => form.relationshipToVeteran !== "I'm the Veteran",
  },
  aboutTheVeteran: {
    title: CHAPTER_3.ABOUT_THE_VET.TITLE,
    uiSchema: aboutTheVeteranPage.uiSchema,
    schema: aboutTheVeteranPage.schema,
    reviewTitle: "Veteran's personal information",
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
    depends: form => form.isVeteranDeceased === 'Yes',
  },
  veteransPostalCode: {
    title: CHAPTER_3.VETERANS_POSTAL_CODE.TITLE,
    uiSchema: veteransPostalCodePage.uiSchema,
    schema: veteransPostalCodePage.schema,
  },
  veteransLocationOfResidence: {
    editModeOnReviewPage: false,
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
    depends: form => form.contactPreference !== 'U.S. mail',
  },
  isQuestionAboutVeteranOrSomeoneElse: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE,
    uiSchema: isQuestionAboutVeteranOrSomeoneElsePage.uiSchema,
    schema: isQuestionAboutVeteranOrSomeoneElsePage.schema,
    CustomPageReview: CustomPageReviewField,
    onNavForward: ({ formData, goPath }) => {
      if (formData.whoQuestionAbout === "I'm the Veteran") {
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
    reviewTitle: 'Your personal information',
  },
  aboutYourselfGeneral: {
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfGeneralPage.uiSchema,
    schema: aboutYourselfGeneralPage.schema,
    reviewTitle: 'Your personal information',
  },
  aboutYourselfRelationshipFamilyMember: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfRelationshipFamilyMemberPage.uiSchema,
    schema: aboutYourselfRelationshipFamilyMemberPage.schema,
    reviewTitle: 'Your personal information',
  },
  searchSchools: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: searchSchoolsPage.uiSchema,
    schema: searchSchoolsPage.schema,
    depends: form => form.useSchoolInProfile === schoolInYourProfileOptions.NO,
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
    depends: form =>
      form.school === 'My facility is not listed' ||
      form.yourRole === yourRoleOptions.VA_EMPLOYEE ||
      form.yourRole === yourRoleOptions.WORK_STUDY_SUP ||
      form.yourRole === yourRoleOptions.OTHER,
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
    depends: form =>
      form.useSchoolInProfile === schoolInYourProfileOptions.NO &&
      form.school !== 'My facility is not listed',
  },
  schoolInYourProfile: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: schoolInYourProfilePage.uiSchema,
    schema: schoolInYourProfilePage.schema,
    depends: form =>
      form.yourRole === yourRoleOptions.SCO ||
      form.yourRole === yourRoleOptions.TRAINING_OR_APPRENTICESHIP_SUP,
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
    depends: form => form.contactPreference === 'U.S. mail',
  },
  yourMailingAddress: {
    title: CHAPTER_3.YOUR_MAILING_ADDRESS.TITLE,
    uiSchema: yourMailingAddressPage.uiSchema,
    schema: yourMailingAddressPage.schema,
    depends: form => form.contactPreference === 'U.S. mail',
  },
  addressValidation: {
    title: CHAPTER_3.ADDRESS_CONFIRM.TITLE,
    uiSchema: addressValidationPage.uiSchema,
    schema: addressValidationPage.schema,
    depends: form => form.contactPreference === 'U.S. mail',
    onNavForward: ({ goPath }) => goPath(CHAPTER_2.PAGE_3.PATH),
  },
  aboutYourFamilyMember: {
    title: CHAPTER_3.ABOUT_YOUR_FAM_MEM.TITLE,
    uiSchema: aboutTheFamilyMemberPage.uiSchema,
    schema: aboutTheFamilyMemberPage.schema,
    reviewTitle: "Family member's personal information",
  },
  aboutYourRelationshipToFamilyMember: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.RELATIONSHIP_TO_FAM_MEM.TITLE,
    uiSchema: aboutYourRelationshipToFamilyMemberPage.uiSchema,
    schema: aboutYourRelationshipToFamilyMemberPage.schema,
    CustomPageReview: CustomPageReviewField,
  },
  theirRelationshipToVeteran: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.RELATIONSHIP_TO_FAM_MEM.TITLE,
    uiSchema: theirRelationshipToVeteranPage.uiSchema,
    schema: theirRelationshipToVeteranPage.schema,
    CustomPageReview: CustomPageReviewField,
  },
  familyMembersLocationOfResidence: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.FAMILY_MEMBERS_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: familyMembersLocationOfResidencePage.uiSchema,
    schema: familyMembersLocationOfResidencePage.schema,
  },
  yourLocationOfResidence: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: yourLocationOfResidencePage.uiSchema,
    schema: yourLocationOfResidencePage.schema,
    depends: form =>
      form.contactPreference !== 'U.S. mail' &&
      !healthcareCategoryLabels.includes(form.selectCategory),
  },
  relationshipToVeteran: {
    editModeOnReviewPage: false,
    path: CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
    title: CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
    uiSchema: relationshipToVeteranPage.uiSchema,
    schema: relationshipToVeteranPage.schema,
    CustomPageReview: CustomPageReviewField,
  },
  yourVAHealthFacility: {
    depends: form => healthcareCategoryLabels.includes(form.selectCategory),
    path: CHAPTER_3.YOUR_VA_HEALTH_FACILITY.PATH,
    title: CHAPTER_3.YOUR_VA_HEALTH_FACILITY.TITLE,
    CustomPage: YourVAHealthFacilityPage,
    CustomPageReview: null,
    schema: {
      // This does still need to be here or it'll throw an error
      type: 'object',
      properties: {}, // The properties can be empty
    },
    uiSchema: {}, // UI schema is completely ignored
  },
};

const aboutMyselfRelationshipVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Myself' &&
    formData.relationshipToVeteran === "I'm the Veteran"
  );
};

const aboutMyselfRelationshipFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Myself' &&
    formData.relationshipToVeteran === "I'm a family member of a Veteran"
  );
};

const aboutSomeoneElseRelationshipVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran === "I'm the Veteran" &&
    formData.selectCategory !== CategoryEducation
  );
};

const aboutSomeoneElseRelationshipFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran === "I'm a family member of a Veteran" &&
    formData.selectCategory !== CategoryEducation
  );
};

const aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran === "I'm a family member of a Veteran"
  );
};

const aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran === "I'm a family member of a Veteran"
  );
};

const aboutSomeoneElseRelationshipConnectedThroughWorkCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran ===
      "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
    formData.selectCategory !== CategoryEducation
  );
};

const aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition = formData => {
  return (
    // Using VEAP (Ch 32) for testing - Will swap it out for VR&E when added to Topics
    formData.relationshipToVeteran ===
      "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
    formData.selectCategory === CategoryEducation &&
    formData.selectTopic !== 'VEAP (Ch 32)'
  );
};

const aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === 'Someone else' &&
    formData.relationshipToVeteran !==
      "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)" &&
    formData.selectCategory === CategoryEducation
  );
};

const generalQuestionCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === "It's a general question" ||
    (formData.selectCategory === CategoryEducation &&
      formData.selectTopic === 'VEAP (Ch 32)')
  );
};

export const flowPages = (obj, list, path) => {
  const pages = _.cloneDeep(obj);
  const flowGroup = {};
  const flowGroupName = path
    .split('-')
    .join('')
    .toLowerCase();

  const conditionMap = {
    aboutmyselfrelationshipveteran: aboutMyselfRelationshipVeteranCondition,
    aboutmyselfrelationshipfamilymember: aboutMyselfRelationshipFamilyMemberCondition,
    aboutsomeoneelserelationshipveteran: aboutSomeoneElseRelationshipVeteranCondition,
    aboutsomeoneelserelationshipfamilymember: aboutSomeoneElseRelationshipFamilyMemberCondition,
    aboutsomeoneelserelationshipfamilymemberaboutveteran: aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition,
    aboutsomeoneelserelationshipfamilymemberaboutfamilymember: aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition,
    aboutsomeoneelserelationshipconnectedthroughwork: aboutSomeoneElseRelationshipConnectedThroughWorkCondition,
    aboutsomeoneelserelationshipconnectedthroughworkeducation: aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition,
    aboutsomeoneelserelationshipveteranorfamilymembereducation: aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition,
    generalquestion: generalQuestionCondition,
  };

  list.forEach((page, index) => {
    const key = `${page}_${flowGroupName}`;
    flowGroup[key] = pages[page];
    flowGroup[key].path = `${path}-${index + 1}`;

    // Add depends clause based on flowGroupName
    if (conditionMap[flowGroupName]) {
      const newCondition = conditionMap[flowGroupName];
      if (flowGroup[key].depends) {
        const existingCondition = flowGroup[key].depends;
        flowGroup[key].depends = formData =>
          existingCondition(formData) && newCondition(formData);
      } else {
        flowGroup[key].depends = newCondition;
      }
    }

    // If last in the list, on nav forward go to the You question page
    if (list.length === index + 1) {
      flowGroup[key].onNavForward = ({ goPath }) =>
        goPath(CHAPTER_2.PAGE_3.PATH); // your-question
    }

    // If first in the list, on nav backward go to the Who is your question about page
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
  'yourVAHealthFacility',
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
  'yourVAHealthFacility',
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
  'yourVAHealthFacility',
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
  'yourVAHealthFacility',
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
  'yourVAHealthFacility',
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
  'yourVAHealthFacility',
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
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
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
  'yourVAHealthFacility',
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
