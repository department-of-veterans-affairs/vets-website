const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories?user_mock_data=true`,
  GET_TOPICS: `/topics?user_mock_data=true`,
  GET_SUBTOPICS: `${baseURL}/topics?user_mock_data=true`,
  // TODO: Add address validation endpoint
  ADDRESS_VALIDATION: '',
  GET_INQUIRY: '',
  UPLOAD_ATTACHMENT: `${baseURL}/upload_attachment`,
};

export const requireSignInCategories = [
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
  'Compensation (Service-Connected Bens)',
  'Veteran Affairs  - Debt', // *double space after 'Affairs'
  'Benefits Issues Outside the US',
];

export const requireSignInTopics = [
  'Compensation',
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
];

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = [
  'GI Bill',
  'Caregiver support',
  'Family member health benefits',
  'Prosthetics',
];

// Response Page headers
export const RESPONSE_PAGE = {
  QUESTION_DETAILS: 'Question details',
  INQUIRY_NUM: 'Inquiry number',
  STATUS: 'Status',
  YOUR_QUESTION: 'Your question',
  ATTACHMENTS: 'Attachments',
  INBOX: 'Inbox',
  SEND_REPLY: 'Send reply',
  UPLOAD_YOUR_FILES: 'Upload your files',
  UPLOAD_BTN: 'Upload file',
  EMPTY_INBOX: 'There are no messages in your inbox',
  NO_ATTACHMENTS: 'There are no attachments',
  YOUR_MESSAGE: 'Your message: ',
  SUBMIT_MESSAGE: 'Send VA a message',
  DELETE_FILE: 'Delete file',
  UPLOAD_INFO: {
    MESSAGE:
      "You'll need to scan your document onto your device to submit this application, such as your computer, tablet, or mobile phone. You can upload your document from there.",
    LIST_HEADING: 'Guidelines for uploading a file:',
    LIST_ITEM_1: 'You can upload a .pdf, .jpeg, or .png file',
    LIST_ITEM_2: 'Your file should be no larger than 25MB',
  },
};

// Used for yes/no radio questions
export const yesNoOptions = {
  YES: 'Yes',
  NO: 'No',
};

// Relationship options
export const relationshipOptions = {
  VETERAN: "I'm the Veteran",
  FAMILY_MEMBER: "I'm a family member of a Veteran",
  WORK:
    "I'm connected to the Veteran through my work (for example, as a School Certifying Official or fiduciary)",
};

// Military base options
export const postOfficeOptions = {
  ARMY_POST_OFFICE: 'Army post office',
  FLEET_POST_OFFICE: 'Fleet post office',
  DIPLOMATIC_POST_OFFICE: 'Diplomatic post office',
};

export const regionOptions = {
  AMERICA_AA: 'Armed Forces America (AA)',
  EUROPE_AE: 'Armed Forces Europe (AE)',
  PACIFIC_AP: 'Armed Forces Pacific (AP)',
};

// Contact options
export const contactOptions = {
  PHONE: 'Phone',
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
  STEPCHILD: "I'm the Veteran's stepchild",
  PARENT: "I'm the Veteran's parent",
  NOT_LISTED: "I have a relationship to the Veteran that's not listed",
};

// Who your question is about
export const whoYourQuestionIsAbout = {
  ABOUT_VETERAN: 'About the Veteran',
  ABOUT_SOMEONE_ELSE: 'About someone else',
};

// Question About options
export const questionAboutOptions = {
  MY_OWN: 'My own VA benefits',
  SOMEONE_ELSE: "Someone else's VA benefits",
  GENERAL: "It's a general question",
};

// Reason options
export const reasonOptions = {
  QUESTION: 'I have a question',
  NICE: 'I want to say something nice',
  COMPLAINT: 'I have a complaint about a service',
  SUGGESTION: 'I have a suggestion',
  TOWN_HALL: 'I attended a Town Hall and now I have a question',
  SOMETHING_ELSE: 'I want to say something else',
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

// Chapter 1 labels: titles, questions, descriptions
export const CHAPTER_1 = {
  CHAPTER_TITLE: 'Category and Topic',
  PAGE_1: {
    PATH: 'category-topic-1',
    TITLE: 'Category selected',
    PAGE_DESCRIPTION: 'Category',
    QUESTION_1: 'Select the category that best describes your question:',
  },
  PAGE_2: {
    PATH: 'category-topic-2',
    TITLE: 'Topic selected',
    PAGE_DESCRIPTION: 'Topic',
    QUESTION_1: 'Select the topic that best describes your question:',
  },
  PAGE_3: {
    PATH: 'category-topic-3',
    TITLE: 'Subtopic selected',
    PAGE_DESCRIPTION: 'Subtopic',
    QUESTION_1: 'Select the subtopic that best describes your question:',
  },
};

// Chapter 2 labels: titles, questions, descriptions
export const CHAPTER_2 = {
  CHAPTER_TITLE: 'Your Question',
  PAGE_1: {
    PATH: 'question-1',
    TITLE: "What's your question about?",
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select what your question is about:',
  },
  PAGE_2: {
    PATH: 'question-2',
    TITLE: "Reason you're contacting us",
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select the reason you are contacting us today: (Optional)',
  },
  PAGE_3: {
    PATH: 'question-3',
    TITLE: 'Your question',
    PAGE_DESCRIPTION: '',
    QUESTION_1: "What's your question?",
  },
};

// Chapter 3 labels: titles, questions, descriptions
export const CHAPTER_3 = {
  CHAPTER_TITLE: 'Personal Information',
  RELATIONSHIP_TO_VET: {
    PATH: 'relationship-to-veteran',
    TITLE: 'Your relationship to the Veteran',
    PAGE_DESCRIPTION:
      "Now we'll ask for some personal information. We use this information to help us understand your question and find the answers you need.",
    QUESTION_1: 'Select your relationship to the Veteran:',
  },
  ABOUT_YOUR_RELATIONSHIP: {
    TITLE: 'Tell us more about your relationship to the Veteran',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select your relationship to the Veteran:',
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
    TITLE: 'When did the Veteran die?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Date',
  },
  VET_POSTAL_CODE: {
    TITLE: "Veteran's postal code",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'The Veteran lives on a United States military base outside of the country.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'Region',
    QUESTION_4: 'Postal code',
  },
  YOUR_POSTAL_CODE: {
    TITLE: 'Your postal code',
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'I receive mail outside of the United States on a U.S. military base.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'Region',
    QUESTION_4: 'Postal code',
  },
  WHO_QUES_IS_ABOUT: {
    TITLE: 'Who your question is about',
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      "Is your question about the Veteran's benefits or someone else's",
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
  PHONE_EMAIL: {
    TITLE: 'Your phone number and email',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Mobile phone number',
    QUESTION_2: 'Email address',
    QUESTION_3: 'How should we contact you?',
  },
  CONTACT_PREF: {
    TITLE: 'Your contact preference',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'How should we contact you?',
  },
  YOUR_COUNTRY: {
    TITLE: 'Your country', // country
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'I live on a United States military base outside of the country',
  },
  YOUR_ADDRESS: {
    TITLE: 'Your address', // full address
    PAGE_DESCRIPTION: '',
  },
  ADDRESS_CONFIRM: {
    TITLE: 'Your address confirmation',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  ABOUT_YOUR_FAM_MEM: {
    TITLE: 'Your relationship to the family member',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select your relationship to the family member',
  },
  RELATIONSHIP_TO_FAM_MEM: {
    TITLE: 'Tell us about the family member',
    PAGE_DESCRIPTION: '',
  },
  YOUR_ROLE: {
    TITLE: 'Your role',
    QUESTION_1: 'Select your role:',
  },
};

export const noEditBtn = [
  CHAPTER_1.PAGE_1.TITLE,
  CHAPTER_1.PAGE_2.TITLE,
  CHAPTER_1.PAGE_3.TITLE,
  CHAPTER_3.ABOUT_YOUR_RELATIONSHIP.TITLE,
];

export const homeBreadcrumbs = [{ href: '/', title: 'Home', key: 'home' }];

export const contactUsBreadcrumbs = [
  ...homeBreadcrumbs,
  { href: '/contact-us', title: 'Contact Us', key: 'contactUs' },
];

export const askVABreadcrumbs = [
  ...contactUsBreadcrumbs,
  { href: '/contact-us/ask-va-too', title: 'Ask VA', key: 'askVA' },
];

export const responsePageBreadcrumbs = [
  ...askVABreadcrumbs,
  { title: 'Response Page', key: 'responsePage' },
];

export const newInquiryBreadcrumbs = [
  ...askVABreadcrumbs,
  { title: 'New Inquiry', key: 'newInquiry' },
];

export const breadcrumbsDictionary = {
  '/': homeBreadcrumbs,
  '/contact-us': contactUsBreadcrumbs,
  '/introduction': askVABreadcrumbs,
  '/user/dashboard': responsePageBreadcrumbs,
  '/newInquiry': newInquiryBreadcrumbs,
};
