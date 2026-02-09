import React from 'react';
import { format, isValid, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { enUS } from 'date-fns/locale';
import PropTypes from 'prop-types';

import {
  branchOfServiceRuleforCategories,
  CategoryBenefitsIssuesOutsidetheUS,
  CategoryEducation,
  CategoryGuardianshipCustodianshipFiduciaryIssues,
  CategoryHealthCare,
  CategoryHousingAssistanceAndHomeLoans,
  CategoryVeteranReadinessAndEmployment,
  CHAPTER_3,
  contactOptions,
  isQuestionAboutVeteranOrSomeoneElseLabels,
  relationshipOptionsMyself,
  relationshipOptionsSomeoneElse,
  statesRequiringPostalCode,
  TopicAppraisals,
  TopicDisabilityCompensation,
  TopicEducationBenefitsAndWorkStudy,
  TopicSpeciallyAdapatedHousing,
  TopicVeteranReadinessAndEmploymentChapter31,
  whoIsYourQuestionAboutLabels,
} from '../constants';
import { clockIcon, folderIcon, starIcon, successIcon } from '../utils/helpers';

export const ServerErrorAlert = () => (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Refresh this page or check back later. You can also sign out of VA.gov and
      try signing back into this page.
    </p>
  </>
);

export const contactRules = {
  'Benefits issues outside the U.S.': {
    'Disability compensation': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Education benefits and work study': ['EMAIL'],
  },
  'Burials and memorials': {
    'Burial allowance': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Burial allowance for unclaimed Veteran remains': ['EMAIL', 'PHONE'],
    'Burial in a VA grant-funded state or tribal cemetery': ['EMAIL', 'PHONE'],
    'Burial in a VA national cemetery': ['EMAIL', 'PHONE'],
    'Memorial items': ['EMAIL', 'PHONE'],
    'Pre-need eligibility for burial': ['EMAIL', 'PHONE'],
    Other: ['EMAIL', 'PHONE'],
  },
  'Center for Minority Veterans': {
    'Programs and policies': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Center for Women Veterans': {
    'General question': ['EMAIL'],
    'Programs and policies': ['EMAIL'],
  },
  'Debt for benefit overpayments and health care copay bills': {
    'Education benefit overpayments (for school officials)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Burial benefit overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Disability compensation overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Drill pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Education benefit overpayments (for students)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Health care copay debt': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Home loan overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Pension benefit overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Separation pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Severance pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Veteran Readiness and Employment overpayments': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
  },
  'Decision reviews and appeals': {
    'Board Appeals': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Higher-Level Reviews or Supplemental Claims': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
  },
  'Defense Enrollment Eligibility Reporting System (DEERS)': {
    'Adding requests': ['EMAIL'],
    'Updating DEERS records': ['EMAIL'],
  },
  'Disability compensation': {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Claim status': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to file a claim': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Education benefits and work study': {
    'Benefits for survivors and dependents': ['EMAIL'],
    'Certificate of Eligibility (COE) or Statement of Benefits': ['EMAIL'],
    'Compliance surveys': ['EMAIL'],
    'Educational and career counseling': ['EMAIL'],
    'Licensing and testing fees': ['EMAIL'],
    'Montgomery GI Bill Active Duty (Chapter 30)': ['EMAIL'],
    'Montgomery GI Bill Selected Reserve (Chapter 1606)': ['EMAIL'],
    'On-the-job training and apprenticeships': ['EMAIL'],
    'Post-9/11 GI Bill (Chapter 33)': ['EMAIL'],
    'Reserve Educational Assistance Program (Chapter 1607)': ['EMAIL'],
    'School Certifying Officials (SCOs)': ['EMAIL'],
    'Transfer of benefits': ['EMAIL'],
    'Tuition Assistance Top-Up': ['EMAIL'],
    'Verifying school enrollment': ['EMAIL'],
    'Veteran Readiness and Employment (Chapter 31)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Veterans’ Educational Assistance Program (Chapter 32)': ['EMAIL'],
    'Web Automated Verification of Enrollment (WAVE)': ['EMAIL'],
    'Work study': ['EMAIL'],
  },
  'Guardianship, custodianship, or fiduciary issues': {
    'Accounting issue': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Investigations and field examinations': ['EMAIL', 'PHONE', 'US_MAIL'],
    Other: ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Health care': {
    'Audiology and hearing aids': ['EMAIL'],
    'Billing and copays': ['EMAIL'],
    'Career opportunities at VA health facilities': ['EMAIL', 'PHONE'],
    'Caregiver support program': ['EMAIL', 'PHONE'],
    'Eligibility and how to apply': ['EMAIL'],
    'Family member health benefits': ['EMAIL', 'PHONE'],
    'Foreign Medical Program': ['EMAIL', 'PHONE'],
    'Getting care at a local VA medical center': ['EMAIL', 'PHONE', 'US_MAIL'],
    Prosthetics: ['EMAIL'],
    'Vet Centers and readjustment counseling': ['EMAIL'],
    "Women's health services": ['EMAIL', 'PHONE'],
  },
  'Housing assistance and home loans': {
    Appraisals: ['EMAIL', 'PHONE'],
    'Funding fee refund': ['EMAIL', 'PHONE'],
    'Help to avoid foreclosure': ['EMAIL', 'PHONE'],
    'Home loan benefits': ['EMAIL', 'PHONE'],
    'Homes for sale by VA': ['EMAIL', 'PHONE'],
    'Home Loan Certificate of Eligibility (COE) or Restoration of Entitlement (ROE)': [
      'EMAIL',
      'PHONE',
    ],
    'Native American Direct Loan (NADL)': ['EMAIL', 'PHONE'],
    'Property titles and taxes for homes sold by VA': ['EMAIL', 'PHONE'],
    'Specially Adapted Housing (SAH) and Special Home Adaptation (SHA) grants': [
      'EMAIL',
      'PHONE',
    ],
  },
  'Life insurance': {
    'Accessing policy online': ['EMAIL', 'PHONE'],
    'Family Servicemembers’ Group Life Insurance (FSGLI)': ['EMAIL', 'PHONE'],
    'Insurance claims': ['EMAIL', 'PHONE'],
    'Insurance premiums': ['EMAIL', 'PHONE'],
    'Insurance website issues': ['EMAIL', 'PHONE'],
    'Policy loans': ['EMAIL', 'PHONE'],
    'Service-Disabled Veterans Life Insurance (S-DVI)': ['EMAIL', 'PHONE'],
    'Servicemembers’ Group Life Insurance (SGLI)': ['EMAIL', 'PHONE'],
    'Veterans Affairs Life Insurance (VALife)': ['EMAIL', 'PHONE'],
    'Veterans’ Group Life Insurance (VGLI)': ['EMAIL', 'PHONE'],
    'Veterans’ Mortgage Life Insurance (VMLI)': ['EMAIL', 'PHONE'],
    Other: ['EMAIL', 'PHONE'],
  },
  Pension: {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Sign in and technical issues': {
    'Signing in to VA.gov and managing VA.gov profile': ['EMAIL'],
    'Signing in to VA life insurance portal': ['EMAIL'],
    'Technical issues on VA.gov': ['EMAIL'],
  },
  'Survivor benefits': {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Claim status': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Veteran ID Card (VIC)': {
    'Veteran Health Identification Card (VHIC) for health appointments': [
      'EMAIL',
    ],
    'Veteran ID Card (VIC) for discounts': ['EMAIL'],
  },
  'Veteran Readiness and Employment': {
    'Financial issues': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Following up on application or contacting counselor': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    Other: ['EMAIL', 'PHONE', 'US_MAIL'],
  },
};

export const getContactMethods = (contactPreferences = []) => {
  let contactMethods = {};

  if (contactPreferences.length > 0) {
    contactPreferences.forEach(item => {
      if (item === 'Phone') contactMethods.PHONE = 'Phone call';
      if (item === 'Email') contactMethods.EMAIL = 'Email';
      if (item === 'USMail') contactMethods.US_MAIL = 'U.S. mail';
    });
  } else {
    contactMethods = {
      PHONE: 'Phone call',
      EMAIL: 'Email',
      US_MAIL: 'U.S. mail',
    };
  }

  return contactMethods;
};

export const isEqualToOnlyEmail = obj => {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === 'EMAIL' && obj.EMAIL === 'Email';
};

export const MilitaryBaseInfo = () => (
  <div className="">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);

// Reference Rules: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Location%20and%20postal%20code.md#guardianship-and-vre
export const isLocationOfResidenceRequired = data => {
  const {
    contactPreference,
    relationshipToVeteran,
    selectCategory,
    selectTopic,
    whoIsYourQuestionAbout,
    isQuestionAboutVeteranOrSomeoneElse,
  } = data;

  // Check if location is required based on contact preference
  if (contactPreference === contactOptions.US_MAIL) {
    return false;
  }

  // Guardianship, VR&E , and Health rules
  const GuardianshipAndVRE =
    (selectCategory === CategoryGuardianshipCustodianshipFiduciaryIssues ||
      selectCategory === CategoryVeteranReadinessAndEmployment) &&
    selectTopic !== 'Other';

  const EducationAndVRE =
    selectCategory === CategoryEducation &&
    selectTopic === TopicVeteranReadinessAndEmploymentChapter31;

  // About myself
  // Flow 1.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN)
  ) {
    return true;
  }

  // Flow 1.2
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER)
  ) {
    return true;
  }

  // About someone else
  // Flow 2.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN)
  ) {
    return true;
  }

  // Flow 2.2.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
      isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN)
  ) {
    return true;
  }

  // Flow 2.2.2
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
      isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE)
  ) {
    return true;
  }

  // Flow 2.3
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.WORK)
  ) {
    return true;
  }

  // Flow 3.1
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.GENERAL
  ) {
    return true;
  }

  // Default to false if none of the conditions are met
  return false;
};

// Reference Rules: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Location%20and%20postal%20code.md#guardianship-and-vre
export const isPostalCodeRequired = data => {
  const {
    contactPreference,
    relationshipToVeteran,
    selectCategory,
    selectTopic,
    whoIsYourQuestionAbout,
    isQuestionAboutVeteranOrSomeoneElse,
    yourLocationOfResidence,
    familyMembersLocationOfResidence,
    veteransLocationOfResidence,
    yourHealthFacility,
  } = data;

  // Check if location is required based on contact preference
  if (contactPreference === contactOptions.US_MAIL) {
    return false;
  }

  // Guardianship, VR&E , and Health rules
  const GuardianshipAndVRE =
    (selectCategory === CategoryGuardianshipCustodianshipFiduciaryIssues ||
      selectCategory === CategoryVeteranReadinessAndEmployment) &&
    selectTopic !== 'Other';

  const EducationAndVRE =
    selectCategory === CategoryEducation &&
    selectTopic === TopicVeteranReadinessAndEmploymentChapter31;

  const HealthCare = selectCategory === CategoryHealthCare;

  const HealthFacilityNotSelected = !yourHealthFacility;

  // About myself
  // Flow 1.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN) &&
    statesRequiringPostalCode.includes(yourLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Flow 1.2
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER) &&
    statesRequiringPostalCode.includes(yourLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // About someone else
  // Flow 2.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN) &&
    statesRequiringPostalCode.includes(familyMembersLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Flow 2.2.1
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
      isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN) &&
    statesRequiringPostalCode.includes(veteransLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
    isQuestionAboutVeteranOrSomeoneElse ===
      isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Flow 2.2.2
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
      isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE) &&
    statesRequiringPostalCode.includes(familyMembersLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER &&
    isQuestionAboutVeteranOrSomeoneElse ===
      isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Flow 2.3
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
      relationshipToVeteran === relationshipOptionsSomeoneElse.WORK) &&
    statesRequiringPostalCode.includes(veteransLocationOfResidence)
  ) {
    return true;
  }
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    relationshipToVeteran === relationshipOptionsSomeoneElse.WORK &&
    isQuestionAboutVeteranOrSomeoneElse ===
      isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Flow 3.1
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    (GuardianshipAndVRE || EducationAndVRE) &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.GENERAL &&
    statesRequiringPostalCode.includes(yourLocationOfResidence)
  ) {
    return true;
  }
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    HealthCare &&
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.GENERAL &&
    HealthFacilityNotSelected
  ) {
    return true;
  }

  // Default to false if none of the conditions are met
  return false;
};

// Reference Rules: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields,%20options%20and%20labels/Field%20rules.md#state-of-property
export const isStateOfPropertyRequired = data => {
  const { selectCategory, selectTopic } = data;

  return (
    selectCategory === CategoryHousingAssistanceAndHomeLoans &&
    (selectTopic === TopicSpeciallyAdapatedHousing ||
      selectTopic === TopicAppraisals)
  );
};

// List of categories required for Branch of service rule: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Field%20rules.md#branch-of-service
export const isBranchOfServiceRequired = data => {
  const { selectCategory, selectTopic, whoIsYourQuestionAbout } = data;

  return (
    (branchOfServiceRuleforCategories.includes(selectCategory) ||
      (selectCategory === CategoryBenefitsIssuesOutsidetheUS &&
        selectTopic === TopicDisabilityCompensation)) &&
    whoIsYourQuestionAbout !== whoIsYourQuestionAboutLabels.GENERAL
  );
};

// Veteran Readiness and Employment (VR&E) rules: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Field%20rules.md#veteran-readiness-and-employment-vre-information
export const isVRERequired = data => {
  const { selectCategory, selectTopic } = data;

  return (
    selectCategory === CategoryVeteranReadinessAndEmployment ||
    (selectCategory === CategoryEducation &&
      selectTopic === TopicVeteranReadinessAndEmploymentChapter31)
  );
};

export const isHealthFacilityRequired = data => {
  const { selectCategory, selectTopic } = data;

  const healthTopics = [
    'Prosthetics',
    'Audiology and hearing aids',
    'Getting care at a local VA medical center',
  ];

  return (
    (selectCategory === 'Health care' && healthTopics.includes(selectTopic)) ||
    (selectCategory ===
      'Debt for benefit overpayments and health care copay bills' &&
      selectTopic === 'Health care copay debt')
  );
};

// Based on Mural flow to make the YourVAHealthFacility component title dynamic (BE only expects yourHealthFacility for any option)
export const getHealthFacilityTitle = data => {
  const {
    YOUR_VA_HEALTH_FACILITY,
    VETERAN_VA_HEALTH_FACILITY,
    FAMILY_MEMBER_VA_HEALTH_FACILITY,
  } = CHAPTER_3;

  const {
    whoIsYourQuestionAbout,
    relationshipToVeteran,
    isQuestionAboutVeteranOrSomeoneElse,
  } = data;

  if (
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF ||
    whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.GENERAL
  ) {
    return YOUR_VA_HEALTH_FACILITY.TITLE;
  }

  if (whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.SOMEONE_ELSE) {
    if (relationshipToVeteran === relationshipOptionsSomeoneElse.VETERAN) {
      return FAMILY_MEMBER_VA_HEALTH_FACILITY.TITLE;
    }

    if (
      relationshipToVeteran === relationshipOptionsSomeoneElse.FAMILY_MEMBER
    ) {
      if (
        isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN
      ) {
        return VETERAN_VA_HEALTH_FACILITY.TITLE;
      }
      if (
        isQuestionAboutVeteranOrSomeoneElse ===
        isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE
      ) {
        return FAMILY_MEMBER_VA_HEALTH_FACILITY.TITLE;
      }
    }

    if (relationshipToVeteran === relationshipOptionsSomeoneElse.WORK) {
      return VETERAN_VA_HEALTH_FACILITY.TITLE;
    }
  }

  return YOUR_VA_HEALTH_FACILITY.TITLE;
};

// Helper functions for statuses https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/ask-va/design/Fields%2C%20options%20and%20labels/Statuses%20and%20triggers.md
export const getVAStatusFromCRM = status => {
  switch (status.toLowerCase()) {
    case 'new':
    case 'in progress':
    case 'inprogress':
    case 'In progress':
      return 'In progress';
    case 'solved':
    case 'replied':
      return 'Replied';
    case 'reopened':
      return 'Reopened';
    case 'closed':
      return 'Closed';
    case 'question not found':
      return "We didn't find any questions with this reference number. Check your reference number and try again.";
    case 'questionnotfound':
      return "We didn't find any questions with this reference number. Check your reference number and try again.";
    default:
      return 'In progress';
  }
};

export const getVAStatusIconAndMessage = {
  New: {
    icon: starIcon,
    message: "We received your question. We'll review it soon.",
    color: 'vads-u-border-color--primary',
  },
  'In progress': {
    icon: clockIcon,
    message: "We're reviewing your question.",
    color: 'vads-u-border-color--grey',
  },
  Replied: {
    icon: successIcon,
    message:
      "We either answered your question or didn't have enough information to answer your question. If you need more help, ask a new question.",
    color: 'vads-u-border-color--green',
  },
  Reopened: {
    icon: clockIcon,
    message: "We received your reply. We'll respond soon.",
    color: 'vads-u-border-color--grey',
  },
  Closed: {
    icon: folderIcon,
    message: 'We closed this question after 60 days without any updates.',
    color: 'vads-u-border-color--grey',
  },
};

export const getDescriptiveTextFromCRM = status => {
  switch ((status ?? '').toLowerCase()) {
    case 'new':
      return 'Your inquiry is current in queue to be reviewed.';
    case 'in progress':
      return 'Your inquiry is currently being reviewed by an agent.';
    case 'solved':
      return 'Your inquiry has been closed. If you have additional questions open a new inquiry.';
    case 'reopened':
      return 'Your reply to this inquiry has been received, and the inquiry is currently being reviewed by an agent.';
    case 'closed':
      return 'Closed.';
    case 'reference number not found':
      return "No Results found. We could not locate an inquiry that matches your ID. Check the number and re-enter. If you receive this message again, you can submit a new inquiry with your original question. Include your old inquiry number for reference and we'll work to get your question fully answered.";
    default:
      return 'error';
  }
};

// Function to convert date to Response Inbox format using date-fns
export const convertDateForInquirySubheader = dateString => {
  // Parse the input date string as UTC
  let utcDate;
  try {
    utcDate = parse(dateString, 'M/d/yyyy h:mm:ss a', new Date(0));
    utcDate.setUTCFullYear(utcDate.getFullYear());
    utcDate.setUTCMonth(utcDate.getMonth());
    utcDate.setUTCDate(utcDate.getDate());
    utcDate.setUTCHours(utcDate.getHours());
    utcDate.setUTCMinutes(utcDate.getMinutes());
    utcDate.setUTCSeconds(utcDate.getSeconds());
  } catch (error) {
    // TODO: This catch block doesn't seem to be hit in testing. johall-tw
    // istanbul ignore next
    return 'Invalid Date';
  }

  // Ensure the date is valid
  if (Number.isNaN(utcDate.getTime())) {
    return 'Invalid Date';
  }

  // Format the UTC date in Eastern Time
  return formatInTimeZone(
    utcDate,
    'America/New_York',
    "MMM. d, yyyy 'at' h:mm aaaa 'E.T'",
    { locale: enUS },
    // ).replace(/AM|PM/, match => `${match.toLowerCase()}.`);
  ).replace(/[AaPp]\.{0,1}[Mm]\.{0,1}/, match => `${match.toLowerCase()}`);
};

export const formatDate = (dateString, formatType = 'short') => {
  let parsedDate = parse(dateString, 'MM/dd/yyyy h:mm:ss a', new Date());

  if (!isValid(parsedDate)) {
    parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
  }

  if (!isValid(parsedDate)) {
    return dateString;
  }

  const dateFormat = formatType === 'long' ? 'MMMM d, yyyy' : 'MMM d, yyyy';

  return format(parsedDate, dateFormat);
};

// Helper for uploading multiple files
export const getFiles = files => {
  if (!files) {
    return [
      {
        FileName: null,
        FileContent: null,
      },
    ];
  }

  return files.map(file => {
    return {
      FileName: file.fileName,
      FileContent: file.base64,
    };
  });
};

export const getFileSizeMB = size => size * 0.00000095367432;

export const DownloadLink = ({ fileUrl, fileName, fileSize }) => {
  const fileSizeText = fileSize
    ? ` (${getFileSizeMB(fileSize).toFixed(2)} MB)`
    : '';

  return (
    <a href={fileUrl} download={fileName}>
      {`${fileName}${fileSizeText}`}
    </a>
  );
};

DownloadLink.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileUrl: PropTypes.string.isRequired,
  fileSize: PropTypes.number,
};

export const isEducationNonVRE = formData =>
  formData.selectCategory === CategoryEducation &&
  formData.selectTopic !== TopicVeteranReadinessAndEmploymentChapter31;

export const isOutsideUSEducation = formData =>
  formData.selectCategory === CategoryBenefitsIssuesOutsidetheUS &&
  formData.selectTopic === TopicEducationBenefitsAndWorkStudy;

// Who is your question about? rules:
// CATEGORY = EDUCATION BENEFITS AND WORK STUDY
// AND
// TOPIC =/ VETERAN READINESS & EMPLOYMENT
//
// ALSO HIDDEN IF:
// CATEGORY =  BENEFITS ISSUES OUTSIDE THE US
// AND
// TOPIC = EDUCATION BENEFITS AND WORK STUDY
//
// BECAUSE 'EDU' QUESTIONS ARE SENT AS "GENERAL QUESTIONS" TO CRM. BUT SHOULD CONTINUE DOWN THE 'SOMEONE ELSE' FLOW.
export const whoIsYourQuestionAboutCondition = formData => {
  return !(isEducationNonVRE(formData) || isOutsideUSEducation(formData));
};

export const aboutMyselfRelationshipVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
    formData.relationshipToVeteran === relationshipOptionsMyself.VETERAN
  );
};

export const aboutMyselfRelationshipFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.MYSELF &&
    formData.relationshipToVeteran === relationshipOptionsMyself.FAMILY_MEMBER
  );
};

export const aboutSomeoneElseRelationshipVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout ===
      whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    formData.relationshipToVeteran === relationshipOptionsMyself.VETERAN &&
    // EDU doesn't apply except when EDU + VRE
    (formData.selectCategory !== CategoryEducation ||
      (formData.selectCategory === CategoryEducation &&
        formData.selectTopic === TopicVeteranReadinessAndEmploymentChapter31))
  );
};

export const aboutSomeoneElseRelationshipFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout ===
      whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    formData.relationshipToVeteran ===
      relationshipOptionsMyself.FAMILY_MEMBER &&
    // EDU doesn't apply except when EDU + VRE
    (formData.selectCategory !== CategoryEducation ||
      (formData.selectCategory === CategoryEducation &&
        formData.selectTopic === TopicVeteranReadinessAndEmploymentChapter31))
  );
};

export const aboutSomeoneElseRelationshipFamilyMemberAboutVeteranCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout ===
      whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    formData.relationshipToVeteran ===
      relationshipOptionsMyself.FAMILY_MEMBER &&
    formData.isQuestionAboutVeteranOrSomeoneElse ===
      isQuestionAboutVeteranOrSomeoneElseLabels.VETERAN
  );
};

export const aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout ===
      whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    formData.relationshipToVeteran ===
      relationshipOptionsMyself.FAMILY_MEMBER &&
    formData.isQuestionAboutVeteranOrSomeoneElse ===
      isQuestionAboutVeteranOrSomeoneElseLabels.SOMEONE_ELSE
  );
};

export const aboutSomeoneElseRelationshipConnectedThroughWorkCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout ===
      whoIsYourQuestionAboutLabels.SOMEONE_ELSE &&
    formData.relationshipToVeteran === relationshipOptionsSomeoneElse.WORK &&
    // EDU doesn't apply except when EDU + VRE
    (formData.selectCategory !== CategoryEducation ||
      (formData.selectCategory === CategoryEducation &&
        formData.selectTopic === TopicVeteranReadinessAndEmploymentChapter31))
  );
};

export const aboutSomeoneElseRelationshipConnectedThroughWorkEducationCondition = formData => {
  return (
    formData.relationshipToVeteran === relationshipOptionsSomeoneElse.WORK &&
    (isEducationNonVRE(formData) || isOutsideUSEducation(formData))
  );
};

export const aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationCondition = formData => {
  return (
    formData.relationshipToVeteran !== relationshipOptionsSomeoneElse.WORK &&
    (isEducationNonVRE(formData) || isOutsideUSEducation(formData))
  );
};

export const generalQuestionCondition = formData => {
  return (
    formData.whoIsYourQuestionAbout === whoIsYourQuestionAboutLabels.GENERAL
  );
};

export const formatDateTimeForAnnouncements = date =>
  format(date, "EEEE, MMMM d, yyyy 'at' h:mm a 'ET'");
