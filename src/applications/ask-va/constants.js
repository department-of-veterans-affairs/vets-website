const baseURL = '/ask_va_api/v0';

export const URL = {
  GET_CATEGORIES: `${baseURL}/categories?mock=true`,
  GET_TOPICS: `/topics?mock=true`,
  GET_SUBTOPICS: `${baseURL}/topics?mock=true`,
  // TODO: Add address validation endpoint
  ADDRESS_VALIDATION: '',
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

// Reason options
export const reasonOptions = {
  question: 'I have a question',
  nice: 'I want to say something nice',
  complaint: 'I have a complaint about a service',
  suggestion: 'I have a suggestion',
  townHall: 'I attended a Town Hall and now I have a question',
  somethingElse: 'I want to say something else',
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
