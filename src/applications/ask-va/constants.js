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
  PAGE_1: {
    PATH: 'personal-info-1',
    TITLE: 'Your relationship to the Veteran',
    PAGE_DESCRIPTION:
      "Now we'll ask for some personal information. We use this information to help us understand your question and find the answers you need.",
    QUESTION_1: 'Select your relationship to the Veteran:',
  },
  PAGE_2: {
    PATH: 'personal-info-2',
    TITLE: 'Tell us more about your relationship to the Veteran',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select your relationship to the Veteran:',
  },
  PAGE_3: {
    PATH: 'personal-info-3',
    TITLE: 'Tell us about the Veteran',
    PAGE_DESCRIPTION: '',
  },
  PAGE_4: {
    PATH: 'personal-info-4',
    TITLE: 'Is the Veteran deceased?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  PAGE_5: {
    PATH: 'personal-info-5',
    TITLE: 'When did the Veteran die?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Date',
  },
  PAGE_6: {
    PATH: 'personal-info-6',
    TITLE: "Veteran's address",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'The Veteran lives on a United States military base outside of the country.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'Region',
    QUESTION_4: 'Postal code',
  },
  PAGE_7: {
    PATH: 'personal-info-7',
    TITLE: 'Who your question is about',
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      "Is your question about the Veteran's benefits or someone else's",
  },
  PAGE_8: {
    PATH: 'personal-info-8',
    TITLE: 'VA employee',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Are you currently an employee of the VA?',
  },
  PAGE_9: {
    PATH: 'personal-info-9',
    TITLE: 'Tell us about yourself',
    PAGE_DESCRIPTION: '',
  },
  PAGE_10: {
    PATH: 'personal-info-10',
    TITLE: 'VA Medical Center',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  PAGE_11: {
    PATH: 'personal-info-11',
    TITLE: 'Your phone number and email',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Mobile phone number',
    QUESTION_2: 'Email address',
    QUESTION_3: 'How should we contact you?',
  },
  PAGE_12: {
    PATH: 'personal-info-12',
    TITLE: 'Your contact preference',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'How should we contact you?',
  },
  PAGE_13: {
    PATH: 'personal-info-13',
    TITLE: 'Your country', // country
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'I live on a United States military base outside of the country',
  },
  PAGE_14: {
    PATH: 'personal-info-14',
    TITLE: 'Your address', // full address
    PAGE_DESCRIPTION: '',
  },
  PAGE_15: {
    PATH: 'personal-info-15',
    TITLE: 'Your address confirmation',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  PAGE_16: {
    PATH: 'personal-info-16',
    TITLE: 'Your relationship to the family member',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Select your relationship to the family member',
  },
  PAGE_17: {
    PATH: 'personal-info-17',
    TITLE: 'Tell us about the family member',
    PAGE_DESCRIPTION: '',
  },
};

export const noEditBtn = [
  CHAPTER_1.PAGE_1.TITLE,
  CHAPTER_1.PAGE_2.TITLE,
  CHAPTER_1.PAGE_3.TITLE,
  CHAPTER_3.PAGE_2.TITLE,
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
