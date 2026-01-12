import { cloneDeep } from 'lodash';
import {
  CategoryDebt,
  CHAPTER_2,
  CHAPTER_3,
  schoolInYourProfileOptions,
  TopicEducationBenefitOverpayments,
  TopicEducationBenefitOverpaymentsForStudents,
  yourRoleOptionsEducation,
} from '../../constants';
import {
  aboutMyselfRelationshipFamilyMemberCondition,
  aboutMyselfRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkCondition,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition,
  aboutSomeoneElseRelationshipFamilyMemberCondition,
  aboutSomeoneElseRelationshipVeteranCondition,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition,
  generalQuestionCondition,
  isBranchOfServiceRequired,
  isHealthFacilityRequired,
  isLocationOfResidenceRequired,
  isPostalCodeRequired,
  isStateOfPropertyRequired,
  isVRERequired,
} from '../helpers';

// Personal Information
import CustomPageReviewField from '../../components/CustomPageReviewField';
import SchoolStateOrResidencyStateCustomPage from '../../containers/SchoolStateOrResidencyStatePage';
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
import moreAboutYourRelationshipToVeteranPage from '../chapters/personalInformation/moreAboutYourRelationshipToVeteran';
import aboutYourRelationshipToFamilyMemberPage from '../chapters/personalInformation/relationshipToFamilyMember';
import relationshipToVeteranPage from '../chapters/personalInformation/relationshipToVeteran';
import schoolInYourProfilePage from '../chapters/personalInformation/schoolInYourProfile';
import schoolStOrResidencyPage from '../chapters/personalInformation/schoolStOrResidency';
import searchSchoolsPage from '../chapters/personalInformation/searchSchools';
import stateOfFacilityPage from '../chapters/personalInformation/stateOfFacility';
import stateOfPropertyPage from '../chapters/personalInformation/stateOfProperty';
import stateOfSchoolPage from '../chapters/personalInformation/stateOfSchool';
import stateOrFacilityPage from '../chapters/personalInformation/stateOrFacility';
import theirRelationshipToVeteranPage from '../chapters/personalInformation/theirRelationshipToVeteran';
import theirVRECounselorPage from '../chapters/personalInformation/theirVRECounselor';
import theirVREInformationPage from '../chapters/personalInformation/theirVREInformation';
import useThisSchoolPage from '../chapters/personalInformation/useThisSchool';
import veteransLocationOfResidencePage from '../chapters/personalInformation/veteransLocationOfResidence';
import veteransPostalCodePage from '../chapters/personalInformation/veteransPostalCode';
import yourBranchOfServicePage from '../chapters/personalInformation/yourBranchOfService';
import yourContactInformationPage from '../chapters/personalInformation/yourContactInformation';
import yourLocationOfResidencePage from '../chapters/personalInformation/yourLocationOfResidence';
import yourMailingAddressPage from '../chapters/personalInformation/yourMailingAddress';
import yourPostalCodePage from '../chapters/personalInformation/yourPostalCode';
import yourRolePage from '../chapters/personalInformation/yourRole';
import yourRoleEducationPage from '../chapters/personalInformation/yourRoleEducation';
import yourVRECounselorPage from '../chapters/personalInformation/yourVRECounselor';
import yourVREInformationPage from '../chapters/personalInformation/yourVREInformation';

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

export const ch3Pages = {
  yourRole: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRolePage.uiSchema,
    schema: yourRolePage.schema,
    CustomPageReview: CustomPageReviewField,
  },
  yourRoleEducation: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_ROLE.TITLE,
    uiSchema: yourRoleEducationPage.uiSchema,
    schema: yourRoleEducationPage.schema,
    CustomPageReview: CustomPageReviewField,
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
  dateOfDeath: {
    title: CHAPTER_3.DEATH_DATE.TITLE,
    uiSchema: deathDatePage.uiSchema,
    schema: deathDatePage.schema,
    depends: form => form.aboutTheVeteran?.isVeteranDeceased === true,
  },
  veteransPostalCode: {
    title: CHAPTER_3.VETERANS_POSTAL_CODE.TITLE,
    uiSchema: veteransPostalCodePage.uiSchema,
    schema: veteransPostalCodePage.schema,
    depends: form => isPostalCodeRequired(form),
  },
  veteransLocationOfResidence: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.VETERAN_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: veteransLocationOfResidencePage.uiSchema,
    schema: veteransLocationOfResidencePage.schema,
    depends: form => isLocationOfResidenceRequired(form),
  },
  familyMembersPostalCode: {
    title: CHAPTER_3.FAMILY_MEMBERS_POSTAL_CODE.TITLE,
    uiSchema: familyMembersPostalCodePage.uiSchema,
    schema: familyMembersPostalCodePage.schema,
    depends: form => isPostalCodeRequired(form),
  },
  yourPostalCode: {
    title: CHAPTER_3.YOUR_POSTAL_CODE.TITLE,
    uiSchema: yourPostalCodePage.uiSchema,
    schema: yourPostalCodePage.schema,
    depends: form => isPostalCodeRequired(form),
  },
  isQuestionAboutVeteranOrSomeoneElse: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.WHO_QUES_IS_ABOUT.TITLE,
    uiSchema: isQuestionAboutVeteranOrSomeoneElsePage.uiSchema,
    schema: isQuestionAboutVeteranOrSomeoneElsePage.schema,
    CustomPageReview: CustomPageReviewField,
    onNavForward: ({ formData, goPath }) => {
      if (formData.isQuestionAboutVeteranOrSomeoneElse === 'Veteran') {
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
    depends: form => !form.hasPrefillInformation,
  },
  aboutYourselfRelationshipFamilyMember: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.ABOUT_YOURSELF.TITLE,
    uiSchema: aboutYourselfRelationshipFamilyMemberPage.uiSchema,
    schema: aboutYourselfRelationshipFamilyMemberPage.schema,
    reviewTitle: 'Your personal information',
    depends: form => !form.hasPrefillInformation,
  },
  schoolInYourProfile: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: schoolInYourProfilePage.uiSchema,
    schema: schoolInYourProfilePage.schema,
    depends: form =>
      // Reference: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields,%20options%20and%20labels/Field%20rules.md#school-fields
      form.schoolInfo?.schoolName &&
      ((form.selectCategory === CategoryDebt &&
        form.selectTopic === TopicEducationBenefitOverpayments) ||
        (form.yourRole === yourRoleOptionsEducation.SCO ||
          form.yourRole ===
            yourRoleOptionsEducation.TRAINING_OR_APPRENTICESHIP_SUP)),
  },
  searchSchools: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: searchSchoolsPage.uiSchema,
    schema: searchSchoolsPage.schema,
    depends: form =>
      (!form.schoolInfo?.schoolName &&
        (form.selectCategory === CategoryDebt &&
          form.selectTopic === TopicEducationBenefitOverpayments)) ||
      (form.useSchoolInProfile === schoolInYourProfileOptions.NO &&
        (form.selectCategory === CategoryDebt &&
          form.selectTopic === TopicEducationBenefitOverpayments)) ||
      ((form.useSchoolInProfile === schoolInYourProfileOptions.NO ||
        !form.schoolInfo?.schoolName) &&
        (form.yourRole === yourRoleOptionsEducation.SCO ||
          form.yourRole ===
            yourRoleOptionsEducation.TRAINING_OR_APPRENTICESHIP_SUP)),
  },
  schoolStOrResidency: {
    title: CHAPTER_3.SCHOOL.TITLE,
    editModeOnReviewPage: false,
    CustomPage: SchoolStateOrResidencyStateCustomPage,
    CustomPageReview: CustomPageReviewField,
    uiSchema: schoolStOrResidencyPage.uiSchema,
    schema: schoolStOrResidencyPage.schema,
  },
  // This only applies for category topic = Education benefit overpayments (for students):
  schoolStOrResidencyForDebtEduStudents: {
    title: CHAPTER_3.SCHOOL.TITLE,
    editModeOnReviewPage: false,
    CustomPage: SchoolStateOrResidencyStateCustomPage,
    CustomPageReview: CustomPageReviewField,
    uiSchema: schoolStOrResidencyPage.uiSchema,
    schema: schoolStOrResidencyPage.schema,
    depends: form =>
      form.selectCategory === CategoryDebt &&
      form.selectTopic === TopicEducationBenefitOverpaymentsForStudents,
  },
  stateOfSchool: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: stateOfSchoolPage.uiSchema,
    schema: stateOfSchoolPage.schema,
    depends: form => form.school === 'My facility is not listed',
  },
  stateOfFacility: {
    title: CHAPTER_3.SCHOOL.TITLE,
    uiSchema: stateOfFacilityPage.uiSchema,
    schema: stateOfFacilityPage.schema,
    depends: form =>
      form.yourRole === yourRoleOptionsEducation.VA_EMPLOYEE ||
      form.yourRole === yourRoleOptionsEducation.WORK_STUDY_SUP ||
      form.yourRole === yourRoleOptionsEducation.OTHER,
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
      form.useSchoolInProfile === schoolInYourProfileOptions.NO ||
      (form.school && form.school !== 'My facility is not listed'),
  },

  yourContactInformation: {
    title: CHAPTER_3.CONTACT_INFORMATION.TITLE,
    uiSchema: yourContactInformationPage.uiSchema,
    schema: yourContactInformationPage.schema,
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
    depends: form => isLocationOfResidenceRequired(form),
  },
  yourLocationOfResidence: {
    editModeOnReviewPage: false,
    title: CHAPTER_3.YOUR_LOCATION_OF_RESIDENCE.TITLE,
    uiSchema: yourLocationOfResidencePage.uiSchema,
    schema: yourLocationOfResidencePage.schema,
    depends: form => isLocationOfResidenceRequired(form),
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
    depends: form => isHealthFacilityRequired(form),
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
  yourVREInformation: {
    title: CHAPTER_3.YOUR_VRE_INFORMATION.TITLE,
    uiSchema: yourVREInformationPage.uiSchema,
    schema: yourVREInformationPage.schema,
    depends: form => isVRERequired(form),
  },
  yourVRECounselor: {
    title: CHAPTER_3.YOUR_VRE_COUNSELOR.TITLE,
    uiSchema: yourVRECounselorPage.uiSchema,
    schema: yourVRECounselorPage.schema,
    depends: form => form.yourVREInformation === true,
  },
  theirVREInformation: {
    title: CHAPTER_3.THEIR_VRE_INFORMATION.TITLE,
    uiSchema: theirVREInformationPage.uiSchema,
    schema: theirVREInformationPage.schema,
    depends: form => isVRERequired(form),
  },
  theirVRECounselor: {
    title: CHAPTER_3.THEIR_VRE_COUNSELOR.TITLE,
    uiSchema: theirVRECounselorPage.uiSchema,
    schema: theirVRECounselorPage.schema,
    depends: form => form.theirVREInformation === true,
  },
  yourBranchOfService: {
    title: CHAPTER_3.BRANCH_OF_SERVICE.TITLE,
    uiSchema: yourBranchOfServicePage.uiSchema,
    schema: yourBranchOfServicePage.schema,
    // TODO - Custom component due to alert message for prefill https://www.figma.com/design/aQ6JsjD4pvMxSVPAZHllMX/AVA-Page-Library?node-id=3029-74800&t=DA4C4u7Wrv7TMhYs-1
    depends: form => isBranchOfServiceRequired(form),
  },
  stateOfProperty: {
    title: CHAPTER_3.STATE_OF_PROPERTY.TITLE,
    uiSchema: stateOfPropertyPage.uiSchema,
    schema: stateOfPropertyPage.schema,
    depends: form => isStateOfPropertyRequired(form),
  },
};

export const flowPages = (obj, list, path) => {
  const pages = cloneDeep(obj);
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
  });
  return flowGroup;
};

// Form flows
const aboutMyselfRelationshipVeteran = [
  // 'aboutYourself',
  'yourBranchOfService',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'yourVREInformation',
  'yourVRECounselor',
  'stateOfProperty',
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
  'dateOfDeath',
  'aboutYourselfRelationshipFamilyMember',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'yourVREInformation',
  'yourVRECounselor',
  'stateOfProperty',
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
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'yourVAHealthFacility',
  'theirVREInformation',
  'theirVRECounselor',
  'stateOfProperty',
  'familyMembersLocationOfResidence',
  'familyMembersPostalCode',
  'aboutYourself',
  'yourBranchOfService',
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
];
export const aboutSomeoneElseRelationshipFamilyMemberPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipFamilyMember,
  flowPaths.aboutSomeoneElseRelationshipFamilyMember,
);

const aboutSomeoneElseRelationshipFamilyMemberAboutVeteran = [
  'moreAboutYourRelationshipToVeteran',
  'aboutTheVeteran',
  'dateOfDeath',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'theirVREInformation',
  'theirVRECounselor',
  'stateOfProperty',
  'veteransLocationOfResidence',
  'veteransPostalCode',
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
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'theirVREInformation',
  'theirVRECounselor',
  'stateOfProperty',
  'familyMembersLocationOfResidence',
  'familyMembersPostalCode',
  'aboutTheVeteran',
  'dateOfDeath',
  'aboutYourselfGeneral',
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
  'dateOfDeath',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'theirVREInformation',
  'theirVRECounselor',
  'stateOfProperty',
  'veteransLocationOfResidence',
  'veteransPostalCode',
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
  'yourRoleEducation',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'stateOfFacility',
  'aboutYourselfGeneral',
  'yourContactInformation',
];
export const aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages = flowPages(
  ch3Pages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducation,
  flowPaths.aboutSomeoneElseRelationshipConnectedThroughWorkEducation,
);

const generalQuestion = [
  'aboutYourselfGeneral',
  'schoolInYourProfile',
  'searchSchools',
  'useThisSchool',
  'stateOfSchool',
  'schoolStOrResidencyForDebtEduStudents',
  'yourVAHealthFacility',
  'yourVREInformation',
  'yourVRECounselor',
  'stateOfProperty',
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
