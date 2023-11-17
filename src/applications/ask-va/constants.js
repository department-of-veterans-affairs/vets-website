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
];

export const requireSignInTopics = [
  'Compensation',
  'Education (Ch.30, 33, 35, 1606, etc. & Work Study)',
];

// list of topics required to render the subtopic page
export const requiredForSubtopicPage = ['GI Bill'];

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
    TITLE: 'Tell us who has a question',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Are you currently an employee of the VA?',
    QUESTION_2: 'Who are you asking a question for?',
  },
  PAGE_3: {
    PATH: 'va-info-3',
    TITLE: '',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Are you the Veteran?',
  },
  PAGE_4: {
    PATH: 'va-info-4',
    TITLE: '',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Are you the dependent?',
  },
  PAGE_5: {
    PATH: 'va-info-5',
    TITLE: '',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Your relationship to the Veteran', // its now a dropdown
  },
  PAGE_6: {
    PATH: 'va-info-6',
    TITLE: '',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'Is the Veteran deceased?',
  },
  PAGE_7: {
    PATH: 'va-info-7',
    TITLE: '',
    PAGE_DESCRIPTION: '',
    QUESTION_1: 'When did the Veteran die?', // use date picker
  },
};
// Chapter 4 labels: titles, questions, descriptions
export const CHAPTER_4 = {
  CHAPTER_TITLE: 'Contact Information',
  PAGE_1: {
    PATH: 'contact-info-1',
    TITLE: "Veteran's address",
    PAGE_DESCRIPTION: '',
    QUESTION_1:
      'The Veteran lives on a United States military base outside of the country.',
    QUESTION_2: "Veterans's zip code",
  },
  PAGE_2: {
    PATH: 'contact-info-2',
    TITLE: 'Tell us about yourself',
    PAGE_DESCRIPTION: '', // import React and make component for this
    QUESTION_1: '', // find personal info platform component
  },
  PAGE_3: {
    PATH: 'contact-info-3',
    TITLE: 'Your email and phone number',
    PAGE_DESCRIPTION: '', // same component from prev page
    QUESTION_1: 'Your mobile phone number', // use phone num component
    QUESTION_2: 'Your email address', // use email component
    QUESTION_3: 'How should we contact you?',
  },
  PAGE_4: {
    PATH: 'contact-info-4',
    TITLE: 'Your address',
    PAGE_DESCRIPTION: '', // same component from prev page
    QUESTION_1: '', // use address component
  },
};
