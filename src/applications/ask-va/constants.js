// import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const envUrl = environment.API_URL;

export const baseURL = '/ask_va_api/v0';

// TODO: This logic assumes that the feature toggle is checked within
// a React component. Need to tweak for use as a constant.
//
// const {
//   TOGGLE_NAMES,
//   useToggleLoadingValue,
//   useToggleValue,
// } = useFeatureToggle();

// const toggleName = TOGGLE_NAMES.askVaMockApiForTesting;
// const isMockApiEnabled = useToggleValue(toggleName);
// const isLoadingFeatureFlags = useToggleLoadingValue(toggleName);

// const isLocalhost = envUrl === 'http://localhost:3000';
// const isToggleEnabled = !isLoadingFeatureFlags && isMockApiEnabled;
// const isProduction = environment.isProduction();

// export const mockTestingFlagforAPI =
//   (isToggleEnabled || isLocalhost) && !isProduction;

export const mockTestingFlagforAPI = envUrl === 'http://localhost:3000'; // enable this flag when testing locally for API calls

// Overridable for testing
export const getMockTestingFlagforAPI = () => mockTestingFlagforAPI;

export const URL = {
  GET_CATEGORIES: `${baseURL}/contents?type=category${
    mockTestingFlagforAPI ? '&user_mock_data=true' : ''
  }`,
  GET_TOPICS: `${baseURL}/contents?type=topic&parent_id=%PARENT_ID%${
    mockTestingFlagforAPI ? '&user_mock_data=true' : ''
  }`,
  GET_SUBTOPICS: `${baseURL}/contents?type=subtopic&parent_id=%PARENT_ID%${
    mockTestingFlagforAPI ? '&user_mock_data=true' : ''
  }`,
  ADDRESS_VALIDATION: `${baseURL}/address_validation`,
  ANNOUNCEMENTS: `${baseURL}/announcements${
    mockTestingFlagforAPI ? '?user_mock_data=true' : ''
  }`,
  GET_HEALTH_FACILITY: `${baseURL}/health_facilities`,
  GET_SCHOOL: `${baseURL}/education_facilities/`,
  SEND_REPLY: `/reply/new`,
  GET_INQUIRIES: `${baseURL}/inquiries`,
  INQUIRIES: `${baseURL}/inquiries`,
  AUTH_INQUIRIES: `${baseURL}/inquiries/auth`,
  DASHBOARD_ID: `/user/dashboard/`,
  DOWNLOAD_ATTACHMENT: `${baseURL}/download_attachment?id=`,
};

// centralized logic for string replacement, incl. multiple fields
// ex: getApiUrl(URL.GET_TOPICS, { PARENT_ID: 1 })

//* @param {string} url - the URL to replace
//* @param {object} params - the object with the key(s) to replace, if any
//* @returns {string} - the URL with the replaced value(s)
export const getApiUrl = (url, params) => {
  let apiUrl = url || '';
  if (params) {
    Object.keys(params).forEach(key => {
      apiUrl = apiUrl.replace(`%${key}%`, params[key]);
    });
  }
  return envUrl + apiUrl;
};

export const branchesOfService = [
  'Air Force',
  'Air Force Academy',
  'Air Force Reserves',
  'Air National Guard',
  'Army',
  'Army Air Corps or Army Air Force',
  'Army National Guard',
  'Army Reserves',
  'Coast Guard',
  'Coast Guard Academy',
  'Coast Guard Reserves',
  'Marine Corps',
  'Marine Corps Reserves',
  'Merchant Marine',
  'National Oceanic & Atmospheric Administration',
  'Naval Academy',
  'Navy',
  'Navy Reserves',
  'Other',
  'Public Health Service',
  'Space Force',
  'US Military Academy',
  "Women's Army Corps",
];

// Categories
export const CategoryBenefitsIssuesOutsidetheUS =
  'Benefits issues outside the U.S.';
export const CategoryDebt =
  'Debt for benefit overpayments and health care copay bills';
export const CategoryEducation = 'Education benefits and work study';
export const CategoryGuardianshipCustodianshipFiduciaryIssues =
  'Guardianship, custodianship, or fiduciary issues';
export const CategoryHealthCare = 'Health care';
export const CategoryHousingAssistanceAndHomeLoans =
  'Housing assistance and home loans';
export const CategoryVeteranReadinessAndEmployment =
  'Veteran Readiness and Employment';

// Topics
export const TopicAppraisals = 'Appraisals';
export const TopicDisabilityCompensation = 'Disability compensation';
export const TopicEducationBenefitsAndWorkStudy =
  'Education benefits and work study';
export const TopicEducationBenefitOverpayments =
  'Education benefit overpayments (for school officials)';
export const TopicEducationBenefitOverpaymentsForStudents =
  'Education benefit overpayments (for students)';
export const TopicVeteranReadinessAndEmploymentChapter31 =
  'Veteran Readiness and Employment (Chapter 31)';
export const TopicSpeciallyAdapatedHousing =
  'Specially Adapted Housing (SAH) and Special Home Adaptation (SHA) grants';

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = [
  'Board Appeals',
  'Caregiver support program',
  'Education benefits and work study',
  'GI Bill',
  'Family health benefits',
  'Memorial items',
  'Prosthetics',
  'Signing in to VA.gov',
  'Signing in to VA.gov and managing VA.gov profile',
  'Technical issues on VA.gov',
  'Transfer of benefits',
  'Veteran Health Identification Card (VHIC) for health appointments',
  'Veteran ID Card (VIC) for discounts',
  'Work study',
];

// List of categories required for Branch of service rule: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Field%20rules.md#branch-of-service
export const branchOfServiceRuleforCategories = [
  'Veteran ID Card (VIC)',
  'Disability compensation',
  'Survivor benefits',
  'Burials and memorials',
  'Center for Women Veterans',
];

// Check to show Your Personal Information page and NOT About Yourself page
export const hasPrefillInformation = form => {
  if (!form?.aboutYourself) return false;

  const { first, last, dateOfBirth, socialOrServiceNum } = form.aboutYourself;
  return !!(
    first &&
    last &&
    dateOfBirth &&
    (socialOrServiceNum?.ssn || socialOrServiceNum?.serviceNumber)
  );
};

// Response Page headers
export const RESPONSE_PAGE = {
  QUESTION_DETAILS: 'Question details',
  INQUIRY_NUM: 'Inquiry number',
  STATUS: 'Status',
  YOUR_QUESTION: 'Your question',
  YOUR_CONVERSATION: 'Your conversation',
  ATTACHMENTS: 'Attachments',
  INBOX: 'Inbox',
  SEND_REPLY: 'Send a reply',
  UPLOAD_YOUR_FILES: 'Upload your files',
  UPLOAD_BTN: 'Upload file',
  EMPTY_INBOX: 'There are no messages in your inbox',
  NO_ATTACHMENTS: 'There are no attachments',
  YOUR_MESSAGE: 'Your message',
  SUBMIT_MESSAGE: 'Send',
  DELETE_FILE: 'Delete file',
  UPLOAD_INFO: {
    MESSAGE:
      "You'll need to scan your document onto your device to submit this application, such as your computer, tablet, or mobile phone. You can upload your document from there.",
    LIST_HEADING: 'Guidelines for uploading a file:',
    LIST_ITEM_1: 'You can upload a .pdf, .jpeg, or .png file',
    LIST_ITEM_2: 'Your file should be no larger than 25MB',
  },
};

export const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV'];

export const pronounLabels = {
  heHimHis: 'He/him/his',
  sheHerHers: 'She/her/hers',
  theyThemTheirs: 'They/them/theirs',
  zeZirZirs: 'Ze/zir/zirs',
  useMyPreferredName: 'Use my preferred name',
};

// Used for yes/no radio questions
export const yesNoOptions = {
  YES: 'Yes',
  NO: 'No',
};

// Relationship options for Myself
export const relationshipOptionsMyself = {
  VETERAN: "I'm the Veteran",
  FAMILY_MEMBER: "I'm a family member of a Veteran",
};

// Relationship options for SomeoneElse
export const relationshipOptionsSomeoneElse = {
  VETERAN: "I'm the Veteran",
  FAMILY_MEMBER: "I'm a family member of a Veteran",
  WORK:
    "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
};

// Military base options
export const postOfficeOptions = {
  APO: 'Army post office',
  FPO: 'Fleet post office',
  DPO: 'Diplomatic post office',
};

export const regionOptions = {
  AA: 'Armed Forces America (AA)',
  AE: 'Armed Forces Europe (AE)',
  AP: 'Armed Forces Pacific (AP)',
};

// Contact options
export const contactOptions = {
  PHONE: 'Phone call',
  EMAIL: 'Email',
  US_MAIL: 'U.S. mail',
};

// Address fields
export const addressFields = {
  STREET: 'Street address',
  STREET_2: 'Street address 2',
  CITY: 'City',
  STATE: 'State/Province/Region',
  ZIP: 'Postal Code',
  POST_OFFICE: 'Post office',
  MILITARY_STATE: 'Region',
};

// Tell us about your relationship to Veteran
export const aboutRelationship = {
  SPOUSE: "I'm the Veteran's spouse",
  CHILD: "I'm the Veteran's child",
  STEPCHILD: "I'm the Veteran's step child",
  PARENT: "I'm the Veteran's parent",
  NOT_LISTED: "We have a relationship that's not listed",
};

// What is your relationship to the family member
export const aboutFamilyMemberRelationship = {
  SPOUSE: "They're my spouse",
  CHILD: "They're my child",
  STEPCHILD: "They're my step child",
  PARENT: "They're my parent",
  NOT_LISTED: "We have a relationship that's not listed",
};

// What is THEIR relationship to the family member
export const aboutTheirRelationshipToVet = {
  SPOUSE: "They're the Veteran's spouse",
  CHILD: "They're the Veteran's child",
  STEPCHILD: "They're the Veteran's step child",
  PARENT: "They're the Veteran's parent",
  NOT_LISTED: "They have a relationship that's not listed",
};

// Who your question is about
export const isQuestionAboutVeteranOrSomeoneElseLabels = {
  VETERAN: 'Veteran',
  SOMEONE_ELSE: 'Someone else',
};

// Question About labels
export const whoIsYourQuestionAboutLabels = {
  MYSELF: 'Myself',
  SOMEONE_ELSE: 'Someone else',
  GENERAL: "It's a general question",
};

// Question About descriptions
export const whoIsYourQuestionAboutDescriptions = {
  GENERAL: `For example, "What type of home loans does the VA offer?`,
};

// Reason options
export const reasonOptions = {
  QUESTION: 'I had a question',
  NICE: 'I wanted to say something nice',
  COMPLAINT: 'I had a complaint about a service',
  SUGGESTION: 'I had a suggestion',
  TOWN_HALL: 'I had a question after attending a Town Hall',
  OTHER: 'Other',
};

// Reason options
export const yourRoleOptions = {
  ACCREDITED_REP:
    'Accredited representative (such as an accredited attorney, claims agent, or Veterans Service Officer)',
  FIDUCIARY: 'Fiduciary',
  FUNERAL_DIR: 'Funeral director',
  TRAINING_OR_APPRENTICESHIP_SUP:
    'On-the-job training or apprenticeship supervisor',
  SCO: 'School Certifying Official (SCO)',
  VA_EMPLOYEE: 'VA employee',
  WORK_STUDY_SUP: 'Work study site supervisor',
  OTHER: 'Other',
};

// State or Facility options
export const stateOrFacilityOptions = {
  SCHOOL_STATE: 'School state',
  SCHOOL_FACILITY: 'School facility',
};

// Do you want to use this school options
export const useThisSchoolOptions = {
  Y: `Yes, replace my saved school facility with this facility.
  This school facility will be saved for future submissions`,
  N: `No, don't update my saved facility.
  This school facility will only be used for this submissions`,
};

// Do you want to use the school facility in your profile options
export const schoolInYourProfileOptions = {
  YES: 'Yes',
  NO: "No, I'll choose a different option",
};

// Reason options
export const yourRoleOptionsEducation = {
  TRAINING_OR_APPRENTICESHIP_SUP:
    'On-the-job training or apprenticeship supervisor',
  SCO: 'School Certifying Official (SCO)',
  VA_EMPLOYEE: 'VA employee',
  WORK_STUDY_SUP: 'Work study site supervisor',
  OTHER: 'Other',
};

// Chapter 1 labels: titles, questions, descriptions
export const CHAPTER_1 = {
  CHAPTER_TITLE: 'Category and topic',
  PAGE_1: {
    PATH: 'category-topic-1',
    TITLE: 'Category',
    PAGE_DESCRIPTION: 'Category',
    QUESTION_1: 'Select the category that best describes your question:',
  },
  PAGE_2: {
    PATH: 'category-topic-2',
    TITLE: 'Topic',
    PAGE_DESCRIPTION: 'Topic',
    QUESTION_1: 'Select the topic that best describes your question:',
  },
  PAGE_3: {
    PATH: 'category-topic-3',
    TITLE: 'Subtopic',
    PAGE_DESCRIPTION: 'Subtopic',
    QUESTION_1: 'Select the subtopic that best describes your question:',
  },
};

// Chapter 2 labels: titles, questions, descriptions
export const CHAPTER_2 = {
  CHAPTER_TITLE: 'Your question',
  PAGE_1: {
    PATH: 'who-is-your-question-about',
    TITLE: 'Who is your question about?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select who your question is about:',
  },
  PAGE_2: {
    PATH: 'reason-you-contacted-us',
    TITLE: 'Reason you contacted us',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select the reason you contacted us today:',
  },
  PAGE_3: {
    PATH: 'your-question',
    TITLE: 'Your question',
    PAGE_DESCRIPTION: '',
    QUESTION_1: "What's your question?",
  },
};

// Chapter 3 labels: titles, questions, descriptions
export const CHAPTER_3 = {
  CHAPTER_TITLE: 'Your Information',
  RELATIONSHIP_TO_VET: {
    PATH: 'relationship-to-veteran',
    TITLE: 'What is your relationship to the Veteran?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  MORE_ABOUT_YOUR_RELATIONSHIP_TO_VETERAN: {
    TITLE: 'Tell us more about your relationship',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  THEIR_RELATIONSHIP_TO_VET: {
    TITLE: 'What is their relationship to the Veteran?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Please describe their relationship to the Veteran',
  },
  ABOUT_THE_VET: {
    TITLE: 'Tell us about the Veteran',
    PAGE_DESCRIPTION: '',
  },
  VET_DECEASED: {
    TITLE: 'Is the Veteran deceased?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  DEATH_DATE: {
    TITLE: "Date of Veteran's death",
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  FAMILY_MEMBERS_POSTAL_CODE: {
    TITLE: "Family member's postal code",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'Family member receives mail outside of the United States on a U.S. military base.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'State',
    QUESTION_4: 'Postal code',
  },
  VETERANS_POSTAL_CODE: {
    TITLE: "Veteran's postal code",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'Veteran receives mail outside of the United States on a U.S. military base.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'State',
    QUESTION_4: 'Postal code',
  },
  YOUR_POSTAL_CODE: {
    TITLE: 'Your postal code',
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'Veteran receives mail outside of the United States on a U.S. military base.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'State',
    QUESTION_4: 'Postal code',
  },
  WHO_QUES_IS_ABOUT: {
    TITLE: 'Is your question about the Veteran or someone else?',
    PAGE_DESCRIPTION: '',
  },
  VA_EMPLOYEE: {
    TITLE: 'VA employee',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Are you currently an employee of the VA?',
  },
  ABOUT_YOURSELF: {
    TITLE: 'Tell us about yourself',
    PAGE_DESCRIPTION: '',
  },
  VA_MED_CENTER: {
    TITLE: 'VA Medical Center',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  SCHOOL: {
    TITLE: 'School information',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  CONTACT_INFORMATION: {
    TITLE: 'Your contact information',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Phone number',
    QUESTION_2: 'Email address',
    QUESTION_3: 'How should we contact you?',
  },
  CONTACT_PREF: {
    TITLE: 'Your contact preference',
    PAGE_DESCRIPTION: '',
    QUESTION_1: {
      QUESTION: 'Preferred name',
      HINT: 'Let us know how we should refer to you.',
      ERROR: 'This field accepts alphabetic characters only',
    },
    QUESTION_2: {
      QUESTION: 'How should we contact you?',
      ERROR: 'Please select your contact preference',
    },
  },
  YOUR_COUNTRY: {
    TITLE: 'Your country', // country
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'I live on a United States military base outside of the country',
  },
  YOUR_MAILING_ADDRESS: {
    TITLE: 'Your mailing address', // full address
    PAGE_DESCRIPTION: '',
  },
  ADDRESS_CONFIRM: {
    TITLE: 'Your address confirmation',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  ADDRESS_VALIDATION: {
    TITLE: 'Check your mailing address',
  },
  ABOUT_YOUR_FAM_MEM: {
    TITLE: 'Tell us about your family member',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  RELATIONSHIP_TO_FAM_MEM: {
    TITLE: 'What is your relationship to the family member?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  YOUR_ROLE: {
    TITLE: 'What is your role?',
  },
  STATE_OR_FACILITY: {
    TITLE: 'School information',
    PAGE_DESCRIPTION: 'Would you like to choose your school state or facility?',
    QUESTION_1: 'Select school or state facility',
  },
  USE_SCHOOL_IN_PROFILE: {
    TITLE: 'Your school facility',
    QUESTION_1: 'Do you want to use the school in your profile?',
  },
  USE_THIS_SCHOOL: {
    TITLE: 'Your school facility',
    QUESTION_1: 'Do you want this to be your saved school facility?',
  },
  STATE_OF_PROPERTY: {
    TITLE: 'State of property',
    QUESTION_1: 'Select state',
  },
  STATE_OF_SCHOOL: {
    TITLE: 'State of school',
    QUESTION_1: 'Select state',
  },
  STATE_OF_FACILITY: {
    TITLE: 'State of facility',
    QUESTION_1: 'Select state',
  },
  SCHOOL_STATE_OR_RESIDENCY: {
    TITLE: 'School state or residency state',
    PAGE_DESCRIPTION: 'School or state of residency',
    QUESTION_1:
      "Please provide your school state. If you don't have a school state, you can provide your residency state instead.",
  },
  VETERAN_LOCATION_OF_RESIDENCE: {
    TITLE: `Veteran's location of residence`,
    QUESTION_1: 'State/Province/Region',
  },
  FAMILY_MEMBERS_LOCATION_OF_RESIDENCE: {
    TITLE: `Family member's location of residence`,
    QUESTION_1: 'State/Province/Region',
  },
  YOUR_LOCATION_OF_RESIDENCE: {
    TITLE: `Your location of residence`,
    QUESTION_1: 'State/Province/Region',
  },
  YOUR_PERSONAL_INFORMATION: {
    PATH: 'your-personal-information',
    TITLE: `Your personal information`,
    DESCRIPTION: 'This is the personal information we have on file for you.',
  },
  YOUR_VA_HEALTH_FACILITY: {
    PATH: 'your-va-health-facility',
    TITLE: 'Your VA health facility',
    DESCRIPTION: 'Search by city, postal code, or use your current location.',
  },
  VETERAN_VA_HEALTH_FACILITY: {
    TITLE: "Veteran's VA health facility",
    DESCRIPTION: 'Search by city, postal code, or use your current location.',
  },
  FAMILY_MEMBER_VA_HEALTH_FACILITY: {
    PATH: 'your-va-health-facility',
    TITLE: "Family member's VA health facility",
    DESCRIPTION: 'Search by city, postal code, or use your current location.',
  },
  YOUR_VRE_INFORMATION: {
    TITLE:
      'Have you ever applied for Veteran Readiness and Employment benefits and services?',
    ERROR: "Please select if you've applied for services.",
  },
  YOUR_VRE_COUNSELOR: {
    TITLE: 'Veteran Readiness and Employment counselor',
    DESCRIPTION: 'Name of your counselor:',
    ERROR: 'Please enter the name of your counselor',
  },
  THEIR_VRE_INFORMATION: {
    TITLE:
      'Have they ever applied for Veteran Readiness and Employment benefits and services?',
    ERROR: "Please select if they've applied for services.",
  },
  THEIR_VRE_COUNSELOR: {
    TITLE: 'Veteran Readiness and Employment counselor',
    DESCRIPTION: 'Name of their counselor:',
    ERROR: 'Please enter the name of their counselor',
  },
  BRANCH_OF_SERVICE: {
    TITLE: 'Your branch of service',
    DESCRIPTION: 'Select your branch of service',
    ERROR: 'Please select your branch of service',
  },
  VETERANS_BRANCH_OF_SERVICE: {
    TITLE: 'Branch of service',
    ERROR: "Please select the Veteran's branch of service",
  },
};

export const noEditBtn = [
  CHAPTER_1.PAGE_1.TITLE,
  CHAPTER_1.PAGE_2.TITLE,
  CHAPTER_1.PAGE_3.TITLE,
  CHAPTER_2.PAGE_1.TITLE,
  CHAPTER_3.RELATIONSHIP_TO_VET.TITLE,
  CHAPTER_3.MORE_ABOUT_YOUR_RELATIONSHIP_TO_VETERAN.TITLE,
];

export const homeBreadcrumbs = [{ href: '/', label: 'Home', key: 'home' }];

export const contactUsBreadcrumbs = [
  ...homeBreadcrumbs,
  { href: '/contact-us', label: 'Contact Us', key: 'contactUs' },
];

export const askVABreadcrumbs = [
  ...contactUsBreadcrumbs,
  { href: '/contact-us/ask-va', label: 'Ask VA', key: 'askVA' },
];

export const questionDetailsBreadcrumbs = [
  ...askVABreadcrumbs,
  {
    href: '/user/dashboard',
    label: 'Question details',
    key: 'questionDetails',
  },
];

export const newQuestionBreadcrumbs = [
  ...askVABreadcrumbs,
  { href: '/newQuestion', label: 'New question', key: 'newQuestion' },
];

export const responseSentBreadcrumbs = [
  ...askVABreadcrumbs,
  { href: '/response-sent', label: 'Question sent', key: 'responseSent' },
];

export const breadcrumbsDictionary = {
  '/': homeBreadcrumbs,
  '/contact-us': contactUsBreadcrumbs,
  '/introduction': askVABreadcrumbs,
  '/user/dashboard': questionDetailsBreadcrumbs,
  '/newQuestion': newQuestionBreadcrumbs,
  '/response-sent': responseSentBreadcrumbs,
};

// Health care label is currently different on local/dev and staging (pulling from CRM updated list)
export const healthcareCategoryLabels = ['Health care', 'VA Health Care'];

// Define the states requiring postal code
export const statesRequiringPostalCode = [
  'California',
  'New York',
  'Pennsylvania',
  'Texas',
];
