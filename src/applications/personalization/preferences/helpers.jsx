import { isEqual } from 'lodash';

import deduplicate from 'platform/utilities/data/deduplicate';
import localStorage from 'platform/utilities/storage/localStorage';

import { LOADING_STATES } from './constants';
import * as components from './helperComponents';

export const DISMISSED_BENEFIT_ALERTS = 'DISMISSED_BENEFIT_ALERTS';

export const benefitChoices = [
  {
    title: 'Health Care',
    description: 'Get health care coverage.',
    code: 'health-care',
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists like cardiologists, gynecologists, and mental health providers. You can access Veterans health care services like home health or geriatric (elder) care, and get medical equipment, prosthetics, and prescriptions.',
    cta: {
      link: '/health-care/apply/application/introduction',
      text: 'Apply Now for VA Health Care',
    },
    faqs: [
      {
        title: 'How do I apply for VA health care?',
        component: components.healthFAQ,
      },
    ],
    alert: components.homelessnessAlert,
  },
  {
    title: 'Disability Compensation',
    description:
      'Find benefits for an illness or injury related to my service.',
    code: 'disability',
    introduction:
      'You may be able to get VA disability compensation (pay) if you got sick or injured while serving in the military—or if a condition that you already had got worse because of your service. You may qualify even if your condition didn’t appear until years after your service ended.',
    cta: {
      link:
        'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
      text: 'File a Claim now on eBenefits',
    },
    faqs: [
      {
        title: 'How do I file a claim for disability compensation?',
        component: components.disabilityFAQ,
      },
    ],
  },
  {
    title: 'Appeals',
    description: 'Appeal the decision VA made on my disability claim.',
    code: 'appeals',
    introduction:
      'If you disagree with our decision on your claim for disability compensation, you can file an appeal. You can also get help from a trained professional like a Veterans Service Officer (VSO) who specializes in filing appeals.',
    faqs: [
      {
        title: 'How do I file an appeal?',
        component: components.appealsFAQ,
      },
    ],
  },
  {
    title: 'Education and Training',
    description: 'Go back to school or get training or certification.',
    code: 'education-training',
    introduction:
      'Education benefits like the GI Bill can help you find and pay for the cost of a college or graduate degree program, or training for a specific career, trade, or industry. If you have a service-connected disability, you may also want to consider applying for vocational rehabilitation and employment services.',
    cta: {
      link: '/education/apply',
      text: 'Apply Now for Education Benefits',
    },
    faqs: [
      {
        title: 'How do I apply for and manage education benefits?',
        component: components.educationFAQ,
      },
    ],
  },
  {
    title: 'Careers and Employment',
    description:
      'Find a job, build skills, or get support for my own business.',
    code: 'careers-employment',
    introduction:
      'We can support your job search at every stage, whether you’re returning to work with a service-connected disability, looking for new skills and training, or starting or growing your own business. ',
    cta: {
      link: '/careers-employment',
      text: 'View All Related Benefits',
    },
    faqs: [
      {
        title: 'What kinds of career and employment benefits does VA offer?',
        component: components.careersFAQ,
      },
    ],
    alert: components.homelessnessAlert,
  },
  {
    title: 'Pension',
    description:
      'Get financial support for my disability or for care related to aging.',
    code: 'pension',
    introduction:
      'If you’re a wartime Veteran with low or no income, and you meet certain age or disability requirements, you may be able to get monthly payments through our pension program. Survivors of wartime Veterans may also qualify for a VA pension.  ',
    cta: {
      link: '/pension/application/527EZ/introduction',
      text: 'Apply Now for Pension Benefits',
    },
    faqs: [
      {
        title: 'How do I apply for VA pension benefits?',
        component: components.pensionFAQ,
      },
    ],
  },
  {
    title: 'Housing Assistance',
    description: 'Find, buy, build, modify, or refinance a place to live.',
    code: 'housing-assistance',
    introduction:
      'We may be able to help you buy or build a home, or repair or refinance your current home. If you have a service-connected disability, you may want to consider applying for a grant to help you make changes to your home that will help you live more independently. ',
    cta: {
      description: components.housingCTADescription,
      link:
        'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=cert-of-eligibility-home-loan',
      text: 'Apply for a Home Loan COE',
    },
    faqs: [
      {
        title: 'What kinds of home loans and grants does VA offer?	',
        component: components.housingFAQ,
      },
    ],
    alert: components.homelessnessAlert,
  },
  {
    title: 'Life Insurance',
    description: 'Learn about my life insurance options.',
    code: 'life-insurance',
    introduction:
      'You may be able to get VA life insurance during and after your active duty service. You may also be able to add coverage for your spouse and dependent children.',
    cta: { description: components.lifeInsuranceCTADescription },
    faqs: [
      {
        title: 'What VA life insurance options may be right for me?',
        component: components.lifeInsuranceFAQ,
      },
    ],
  },
  {
    title: 'Burial Benefits and Memorial Items',
    description:
      'Apply for burial in a VA cemetery or for allowances to cover burial costs.',
    code: 'burials-memorials',
    introduction:
      'We can help you plan a burial or memorial service or honor a Veteran’s service with memorial items. If you’re the surviving family member of a Veteran, you may also be able to get help paying for burial costs and other benefits.',
    cta: {
      description: components.burialCTADescription,
      link:
        '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility/introduction',
      text: 'Apply for Pre-Need Burial Eligibility',
    },
    faqs: [
      {
        title: 'What burial benefits and memorial items does VA offer?',
        component: components.burialFAQ,
      },
    ],
  },
  {
    title: 'Family and Caregiver Benefits',
    description: 'Learn about benefits for family members and caregivers.',
    code: 'family-caregiver-benefits',
    introduction:
      'If you’re the family member of a Veteran or Servicemember, you may qualify for benefits yourself. If you’re a caregiver for a Veteran with service-connected disabilities, you may qualify for additional benefits and support for yourself and the Veteran you’re caring for.',
    faqs: [
      {
        title: 'What kinds of family and caregiver benefits does VA offer?',
        component: components.familyFAQ,
      },
      {
        title: 'What kinds of benefits does VA offer to survivors?',
        component: components.survivorFAQ,
      },
    ],
    alert: components.homelessnessAlert,
  },
];

// takes the user's selected benefits, as stored in the Redux store, and
// converts it to the JSON expected by the v0/user/preferences POST request body
export function transformPreferencesForSaving(preferences) {
  if (typeof preferences !== 'object') {
    return null;
  }
  const processedData = [
    {
      preference: {
        code: 'benefits',
      },
      // eslint-disable-next-line camelcase
      user_preferences: [],
    },
  ];
  Object.entries(preferences).forEach(([key, value]) => {
    if (value) {
      processedData[0].user_preferences.push({ code: key });
    }
  });
  return JSON.stringify(processedData);
}

/**
 * Removes the specified items from the provided list.
 * Incidentally, the provided list is also deduplicated
 * as it is converted into a set for more efficient removal.
 * @export
 * @param {Array} list
 * @param {Array} items
 * @returns {Array}
 */
export const filterItems = (list, items) => {
  const filteredList = new Set(list);
  items.forEach(item => filteredList.delete(item));
  return Array.from(filteredList);
};

export const getDismissedBenefitAlerts = () =>
  JSON.parse(localStorage.getItem(DISMISSED_BENEFIT_ALERTS)) || [];

/**
 * Deduplicates and stores a list of dismissed benefit alerts
 * to local storage.
 *
 * @param {Array} dismissedBenefitAlerts
 */
export const setDismissedBenefitAlerts = dismissedBenefitAlerts =>
  localStorage.setItem(
    DISMISSED_BENEFIT_ALERTS,
    JSON.stringify(deduplicate(dismissedBenefitAlerts)),
  );

export const dismissBenefitAlert = name => {
  const dismissedBenefitAlerts = getDismissedBenefitAlerts();
  dismissedBenefitAlerts.push(name);
  setDismissedBenefitAlerts(dismissedBenefitAlerts);
};

/**
 * Filters any new benefit alerts from the list of
 * dismissed benefit alerts and sets the updated
 * list to local storage.
 *
 * @param {Array} newBenefitAlerts
 */
export const restoreDismissedBenefitAlerts = newBenefitAlerts => {
  let dismissedBenefitAlerts = getDismissedBenefitAlerts();
  dismissedBenefitAlerts = filterItems(
    dismissedBenefitAlerts,
    newBenefitAlerts,
  );
  setDismissedBenefitAlerts(dismissedBenefitAlerts);
};

export const getNewSelections = (previousSelections, nextSelections) =>
  Object.keys(nextSelections).filter(
    key => !!nextSelections[key] && !previousSelections[key],
  );

export const didPreferencesChange = (prevProps, props) =>
  !isEqual(prevProps.preferences, props.preferences);

export const didJustSave = (prevProps, props) =>
  prevProps.preferences.saveStatus === LOADING_STATES.pending &&
  props.preferences.saveStatus === LOADING_STATES.loaded;

export const didJustFailToSave = (prevProps, props) =>
  prevProps.preferences.saveStatus === LOADING_STATES.pending &&
  props.preferences.saveStatus === LOADING_STATES.error;
