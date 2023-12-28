const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories?mock=true`,
  GET_TOPICS: `/topics?mock=true`,
  GET_SUBTOPICS: `${baseURL}/topics?mock=true`,
  // TODO: Add address validation endpoint
  ADDRESS_VALIDATION: '',
  GET_INQUIRY: '',
};

export const requireSignInCategories = [
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
  'Compensation (Service-Connected Bens)',
];

export const requireSignInTopics = [
  'Compensation',
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
];

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = ['GI Bill'];

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
export const personalOptions = {
  GI_BILL_BENEFICIARY: 'GI Bill beneficiary',
  OTHER_PERSONAL_RELATIONSHIP: 'Other personal relationship',
};

export const businessOptions = {
  TRAINING_OR_APPRENTICESHIP:
    'On-the-job training or apprenticeship supervisor',
  SCHOOL_CERTIFYING_OFFICAL: 'School Certifying Official',
  VA_EMPLOYEE: 'VA employee',
  WORK_STUDY_SUPERVISOR: 'Work study site supervisor',
  OTHER_BUSINESS_RELATIONSHIP: 'Other business relationship',
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
  POST_OFFICE: 'Military post office',
  MILITARY_STATE: 'State',
};

// Chapter 1 labels: titles, questions, descriptions
export const CHAPTER_1 = {
  CHAPTER_TITLE: 'Category and Topic',
  PAGE_1: {
    PATH: 'category-topic-1',
    TITLE: 'Category selected',
    PAGE_DESCRIPTION: 'Which category best describes your question?',
    QUESTION_1: 'Category',
  },
  PAGE_2: {
    PATH: 'category-topic-2',
    TITLE: 'Topic selected',
    PAGE_DESCRIPTION: 'Which topic best describes your question?',
    QUESTION_1: 'Topic',
  },
  PAGE_3: {
    PATH: 'category-topic-3',
    TITLE: 'Subtopic selected',
    PAGE_DESCRIPTION: 'Which subtopic best describes your question?',
    QUESTION_1: 'Subtopic',
  },
};

// Chapter 2 labels: titles, questions, descriptions
export const CHAPTER_2 = {
  CHAPTER_TITLE: 'Your Question',
  PAGE_1: {
    PATH: 'question-1',
    TITLE: 'Tell us your question',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'What is your question?',
    QUESTION_2: "Tell us the reason you're contacting us:",
  },
};

// Chapter 3 labels: titles, questions, descriptions
export const CHAPTER_3 = {
  CHAPTER_TITLE: 'VA Information',
  PAGE_1: {
    PATH: 'va-info-1',
    TITLE: 'VA Medical Center',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
  PAGE_2: {
    PATH: 'va-info-2',
    TITLE: 'Who is asking a question',
    PAGE_DESCRIPTION: 'Tell us who has a question',
    QUESTION_1: 'Are you currently an employee of the VA?',
    QUESTION_2: 'Who are you asking a question for?',
  },
  PAGE_3: {
    PATH: 'va-info-3',
    TITLE: 'Are you the Veteran?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  PAGE_4: {
    PATH: 'va-info-4',
    TITLE: 'Are you the dependent?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  PAGE_5: {
    PATH: 'va-info-5',
    TITLE: 'Your relationship to the Veteran',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  PAGE_6: {
    PATH: 'va-info-6',
    TITLE: 'Is the Veteran deceased?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Selection',
  },
  PAGE_7: {
    PATH: 'va-info-7',
    TITLE: 'When did the Veteran die?',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Date',
  },
};

// Chapter 4 labels: titles, questions, descriptions
export const CHAPTER_4 = {
  CHAPTER_TITLE: 'Contact Information',
  PAGE_1: {
    PATH: 'contact-info-2',
    TITLE: "Veteran's address",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'The Veteran lives on a United States military base outside of the country.',
    QUESTION_2: 'Post office',
    QUESTION_3: 'Region',
    QUESTION_4: 'Postal code',
  },
  PAGE_2: {
    PATH: 'contact-info-1',
    TITLE: 'Tell us about the Veteran',
    PAGE_DESCRIPTION: '',
  },
  PAGE_3: {
    PATH: 'contact-info-3',
    TITLE: 'Tell us about yourself',
    PAGE_DESCRIPTION: '',
  },
  PAGE_4: {
    PATH: 'contact-info-4',
    TITLE: 'Your phone number and email',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Mobile phone number',
    QUESTION_2: 'Email address',
    QUESTION_3: 'How should we contact you?',
  },
  PAGE_5: {
    PATH: 'contact-info-5',
    TITLE: 'Your country', // country
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'I live on a United States military base outside of the country',
  },
  PAGE_6: {
    PATH: 'contact-info-6',
    TITLE: 'Your address', // full address
    PAGE_DESCRIPTION: '',
  },
  PAGE_7: {
    PATH: 'contact-info-7',
    TITLE: 'Your address confirmation',
    PAGE_DESCRIPTION: '',
    QUESTION_1: '',
  },
};

export const noEditBtn = [
  CHAPTER_1.PAGE_1.TITLE,
  CHAPTER_1.PAGE_2.TITLE,
  CHAPTER_1.PAGE_3.TITLE,
  CHAPTER_3.PAGE_2.TITLE,
];
