import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const envUrl = environment.API_URL;

// Used to test against dev
// export const envUrl = 'https://dev-api.va.gov';
//

export const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories?user_mock_data=true`,
  GET_CATEGORIESTOPICS: `${baseURL}/categories`,
  GET_TOPICS: `topics?user_mock_data=true`,
  GET_SUBTOPICS: `${baseURL}/topics`,
  ADDRESS_VALIDATION: `${baseURL}/address_validation`,
  UPLOAD_ATTACHMENT: `${baseURL}/upload_attachment`,
  GET_HEALTH_FACILITY: `${baseURL}/health_facilities`,
  GET_SCHOOL: `/v0/gi/institutions/search?name=`,
  SEND_REPLY: `/reply/new`,
};

export const requireSignInCategories = [
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
  'Disability compensation',
  'Debt for benefit overpayments and health care copay bills',
  'Benefits issues outside the U.S.',
];

export const requireSignInTopics = [
  'Compensation',
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
];

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = [
  'GI Bill',
  'Caregiver support program',
  'Family health benefits',
  'Prosthetics',
  'Veteran Health Identification Card (VHIC) for health appointments',
  'Veteran ID Card (VIC) for discounts',
];

// Check to show Your Personal Information page and NOT About Yourself page
export const hasPrefillInformation = form => {
  const { first, last, dateOfBirth, socialOrServiceNum } = form.aboutYourself;

  return !!(first && last && dateOfBirth && socialOrServiceNum);
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
export const whoYourQuestionIsAbout = {
  VETERAN: 'Veteran',
  SOMEONE_ELSE: 'Someone else',
};

// Question About labels
export const questionAboutLabels = {
  MYSELF: 'Myself',
  SOMEONE_ELSE: 'Someone else',
  GENERAL: "It's a general question",
};

// Question About descriptions
export const questionAboutDescriptions = {
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
    TITLE: 'Tell us more about your relationship?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  THEIR_RELATIONSHIP_TO_VET: {
    TITLE: 'What is their relationship to the veteran?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Please describe their relationship to the veteran',
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
    QUESTION_1: 'Select who your question is about:',
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
    QUESTION_2: 'How should we contact you?',
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
    TITLE: 'Your role',
    QUESTION_1: 'Select your role:',
  },
  STATE_OR_FACILITY: {
    TITLE: 'School information',
    PAGE_DESCRIPTION: 'Would you like to choose your school state or facility?',
    QUESTION_1: 'Select school or state facility',
  },
  USE_THIS_SCHOOL: {
    TITLE: 'School information',
    QUESTION_1: 'Do you want to use this school?',
  },
  STATE_OF_SCHOOL: {
    TITLE: 'State of school',
    QUESTION_1: 'Select state',
  },
  SCHOOL_STATE_OR_RESIDENCY: {
    TITLE: 'School information',
    PAGE_DESCRIPTION: 'School or state of residency',
    QUESTION_1: 'Please provide one of the following',
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
  { href: '/contact-us/ask-va-too', label: 'Ask VA', key: 'askVA' },
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

export const breadcrumbsDictionary = {
  '/': homeBreadcrumbs,
  '/contact-us': contactUsBreadcrumbs,
  '/introduction': askVABreadcrumbs,
  '/user/dashboard': questionDetailsBreadcrumbs,
  '/newQuestion': newQuestionBreadcrumbs,
};

// Health care label is currently different on local/dev and staging (pulling from CRM updated list)
export const healthcareCategoryLabels = ['Health care', 'VA Health Care'];
