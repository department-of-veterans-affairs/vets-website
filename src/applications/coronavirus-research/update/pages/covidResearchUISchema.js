import React from 'react';

import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import MonthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import get from 'platform/utilities/data/get';
import CustomReviewField from '../containers/CustomReviewField';
import CustomReviewRadio from '../containers/customReviewRadio';
import CustomReviewYesNo from '../containers/customReviewYesNo';
// import { facilityUiSchema } from '../config/va-location/va-location';
import DynamicRadioWidget from '../config/va-location/DynamicRadioWidget.jsx';

const conditionalValidateBooleanGroup = (errors, pageData) => {
  const { diagnosed, DIAGNOSED_DETAILS } = pageData;
  if (diagnosed) {
    validateBooleanGroup(errors.DIAGNOSED_DETAILS, DIAGNOSED_DETAILS);
  }
};

function vaLocationReviewWidget({ value }) {
  return <span>{value ? value?.split('|')[0] : `None`}</span>;
}

export const uiSchema = {
  descriptionText: {
    'view:descriptionText': {
      'ui:description': (
        <span>
          Thank you for your volunteering to receive information on coronavirus
          disease (COVID-19) research at VA. Please answer the questions below,
          and we’ll update your information. If we think you may be eligible for
          one of our COVID-19 studies, we’ll contact you to tell you more about
          it so you can decide if you want to join.
        </span>
      ),
    },
  },
  formCompleteTimeText: {
    'view:formCompleteTimeText': {
      'ui:description': (
        <span>This form will take you 3 to 5 minutes to complete.</span>
      ),
    },
    'ui:options': {
      classNames: 'schemaform-block-title schemaform-block-subtitle',
    },
  },
  vaccinated: {
    'ui:title': (
      <span>
        <strong>Have you received a COVID-19 vaccine?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  VACCINATED_PLAN: {
    'ui:title': (
      <span>
        <strong>Do you plan to be vaccinated?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewRadio,
    'ui:widget': 'radio',
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      expandUnderCondition: false,
      labels: {
        DEFINITELY: 'Will definitely get vaccinated',
        PROBABLY_YES: 'Will probably get vaccinated',
        PROBABLY_NO: 'Will probably NOT get vaccinated',
        DEFINITELY_NO: 'Will definitely NOT get vaccinated',
        UNSURE: 'Not yet decided',
      },
      classNames: '',
    },
    'ui:required': formData => !formData.vaccinated,
  },
  VACCINATED_DETAILS: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      expandUnderCondition: true,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        JOHNSON: 'Johnson & Johnson',
        NOVAVAX: 'Novavax',
        ASTRA: 'Astra Zeneca',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.vaccinated,
  },
  VACCINATED_DATE1: {
    ...currentOrPastMonthYearUI('Month/Year of 1st dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData => get('VACCINATED_DETAILS', formData) === undefined,
      classNames: '',
    },
    'ui:required': formData => formData.vaccinated,
  },
  VACCINATED_DATE2: {
    ...MonthYearUI('Month/Year of 2nd dose (or future date if scheduled)'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_DETAILS', formData) === undefined ||
        get('VACCINATED_DETAILS', formData) === 'JOHNSON' ||
        formData.VACCINATED_SECOND === true,
      classNames: '',
    },
    'ui:required': formData =>
      (formData.VACCINATED_SECOND === undefined ||
        formData.VACCINATED_SECOND === false) &&
      formData.vaccinated &&
      get('VACCINATED_DETAILS', formData) !== 'JOHNSON',
  },
  VACCINATED_SECOND: {
    'ui:title': <span>Did not get second dose</span>,
    'ui:reviewField': CustomReviewField,
    'ui:widget': 'checkbox',
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_DETAILS', formData) === undefined ||
        get('VACCINATED_DETAILS', formData) === 'JOHNSON' ||
        formData.VACCINATED_DATE2 !== undefined,
    },
    'ui:required': formData =>
      formData.VACCINATED_DATE2 === undefined &&
      formData.vaccinated &&
      get('VACCINATED_DETAILS', formData) !== 'JOHNSON',
  },
  VACCINATED_ADDITIONAL1: {
    'ui:title': (
      <span>
        <strong>
          Have you received any additional vaccine doses (including boosters)?
        </strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'vaccinated',
      expandUnderCondition: true,
      classNames: '',
    },
    'ui:required': formData => formData.vaccinated,
  },
  VACCINATED_ADDITIONAL_DETAILS1: {
    'ui:title': (
      <span>
        <strong>If Yes, which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL1', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL1,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        OTHER: 'Other',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL1,
  },
  VACCINATED_ADDITIONAL_OTHER1: {
    'ui:title': 'Which vaccine?',
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS1', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL1 ||
        get('VACCINATED_ADDITIONAL_DETAILS1', formData) !== 'OTHER',
      classNames: '',
    },
    'ui:required': formData =>
      get('VACCINATED_ADDITIONAL_DETAILS1', formData) === 'OTHER',
  },
  VACCINATED_ADDITIONAL_DATE1: {
    ...currentOrPastMonthYearUI('Month/Year of dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS1', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL1,
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL1,
  },
  VACCINATED_ADDITIONAL2: {
    'ui:title': <span>Enter another dose</span>,
    'ui:reviewField': CustomReviewField,
    'ui:widget': 'checkbox',
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS1', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL1,
    },
  },
  VACCINATED_ADDITIONAL_DETAILS2: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL2', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL2,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        OTHER: 'Other',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL2,
  },
  VACCINATED_ADDITIONAL_OTHER2: {
    'ui:title': 'Which vaccine?',
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS2', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL2 ||
        get('VACCINATED_ADDITIONAL_DETAILS2', formData) !== 'OTHER',
      classNames: '',
    },
    'ui:required': formData =>
      get('VACCINATED_ADDITIONAL_DETAILS2', formData) === 'OTHER',
  },
  VACCINATED_ADDITIONAL_DATE2: {
    ...currentOrPastMonthYearUI('Month/Year of dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS2', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL2,
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL2,
  },
  VACCINATED_ADDITIONAL3: {
    'ui:title': <span>Enter another dose</span>,
    'ui:reviewField': CustomReviewField,
    'ui:widget': 'checkbox',
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS2', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL2,
    },
  },
  VACCINATED_ADDITIONAL_DETAILS3: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL3', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL3,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        OTHER: 'Other',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL3,
  },
  VACCINATED_ADDITIONAL_OTHER3: {
    'ui:title': 'Which vaccine?',
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS3', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL3 ||
        get('VACCINATED_ADDITIONAL_DETAILS3', formData) !== 'OTHER',
      classNames: '',
    },
    'ui:required': formData =>
      get('VACCINATED_ADDITIONAL_DETAILS3', formData) === 'OTHER',
  },
  VACCINATED_ADDITIONAL_DATE3: {
    ...currentOrPastMonthYearUI('Month/Year of dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS3', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL3,
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL3,
  },
  VACCINATED_ADDITIONAL4: {
    'ui:title': <span>Enter another dose</span>,
    'ui:reviewField': CustomReviewField,
    'ui:widget': 'checkbox',
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS3', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL3,
    },
  },
  VACCINATED_ADDITIONAL_DETAILS4: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL4', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL4,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        OTHER: 'Other',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL4,
  },
  VACCINATED_ADDITIONAL_OTHER4: {
    'ui:title': 'Which vaccine?',
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS4', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL4 ||
        get('VACCINATED_ADDITIONAL_DETAILS4', formData) !== 'OTHER',
      classNames: '',
    },
    'ui:required': formData =>
      get('VACCINATED_ADDITIONAL_DETAILS4', formData) === 'OTHER',
  },
  VACCINATED_ADDITIONAL_DATE4: {
    ...currentOrPastMonthYearUI('Month/Year of dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS4', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL4,
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL4,
  },
  VACCINATED_ADDITIONAL5: {
    'ui:title': <span>Enter another dose</span>,
    'ui:reviewField': CustomReviewField,
    'ui:widget': 'checkbox',
    'ui:options': {
      hideLabelText: true,
      hideOnReview: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS4', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL4,
    },
  },
  VACCINATED_ADDITIONAL_DETAILS5: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL5', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL5,
      labels: {
        MODERNA: 'Moderna',
        PFIZER: 'Pfizer',
        OTHER: 'Other',
        UNKNOWN: "Don't know/Don't remember",
      },
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL5,
  },
  VACCINATED_ADDITIONAL_OTHER5: {
    'ui:title': 'Which vaccine?',
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS5', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL5 ||
        get('VACCINATED_ADDITIONAL_DETAILS5', formData) !== 'OTHER',
      classNames: '',
    },
    'ui:required': formData =>
      get('VACCINATED_ADDITIONAL_DETAILS5', formData) === 'OTHER',
  },
  VACCINATED_ADDITIONAL_DATE5: {
    ...currentOrPastMonthYearUI('Month/Year of dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      monthYear: true,
      hideIf: formData =>
        get('VACCINATED_ADDITIONAL_DETAILS5', formData) === undefined ||
        !formData.VACCINATED_ADDITIONAL5,
      classNames: '',
    },
    'ui:required': formData => formData.VACCINATED_ADDITIONAL5,
  },
  diagnosed: {
    'ui:title': (
      <span>
        <strong>Have you ever been diagnosed with COVID-19?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  DIAGNOSED_DETAILS: {
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'diagnosed',
    },
    'ui:required': formData => formData.diagnosed,
    'ui:title': (
      <span>
        <strong>How were you diagnosed?</strong>
        <br />
        (Please check all that apply.)
        <br />
      </span>
    ),
    'DIAGNOSED_DETAILS::SYMPTOMS_ONLY': {
      'ui:title': 'Based on my symptoms',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_DETAILS::ANTIBODY_BLOOD_TEST': {
      'ui:title': 'With a positive antibody blood test',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_DETAILS::NASAL_SWAB_TEST_POSITIVE': {
      'ui:title': 'With a positive nasal swab test',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_DETAILS::DIFFERENT_METHOD': {
      'ui:title': 'With a different method',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_DETAILS::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
      'ui:reviewField': CustomReviewField,
    },
  },
  DIAGNOSED_SYMPTOMS: {
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'diagnosed',
    },
    'ui:required': formData => formData.diagnosed,
    'ui:title': (
      <span>
        <strong>
          Have you experienced/are you still experiencing any of the following
          symptoms at least 4 weeks after the onset of your COVID-19 illness?
        </strong>
        <br />
        (Please check all that apply.)
        <br />
      </span>
    ),
    'DIAGNOSED_SYMPTOMS::FATIGUE': {
      'ui:title': 'Ongoing or debilitating fatigue',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::TACHYCARDIA': {
      'ui:title': 'Tachycardia (fast heartbeat/hear flutters)',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::BREATHING': {
      'ui:title': 'Shortness of breath/difficulty breathing/chest pain',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::NUMBNESS': {
      'ui:title': 'Numbness/tingling',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::FOCUS': {
      'ui:title': 'Difficulty concentrating or focusing (Brain fog)',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::HEADACHE': {
      'ui:title': 'Headache',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::SLEEP': {
      'ui:title': 'Difficulty Sleeping',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::CLOTS': {
      'ui:title': 'Blood clots/clotting issues',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::DIZZINESS': {
      'ui:title': 'Dizziness (vertigo)',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::VISION': {
      'ui:title': 'Blurred vision',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::ANXIETY': {
      'ui:title': 'Anxiety/depression',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::TASTE_SMELL': {
      'ui:title': 'Loss of Taste/loss of smell',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::GI': {
      'ui:title': 'GI symptoms (heart burn, loss of appetite, abdominal pain)',
      'ui:reviewField': CustomReviewField,
    },
    'DIAGNOSED_SYMPTOMS::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
      'ui:reviewField': CustomReviewField,
    },
  },
  ELIGIBLE: {
    'ui:title': (
      <span>
        <strong>Are you eligible to receive care at a VA facility?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  FACILITY: {
    'ui:title': (
      <span>
        <strong>Do you receive care at a VA facility?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  zipCode: {
    'ui:title': 'Zip code where you primarily receive VA care',
    'ui:errorMessages': {
      pattern:
        'Please enter a valid 5- or 9-digit zip code if known (dashes allowed)',
    },
    'ui:options': {
      classNames: 'input-width',
      expandUnder: 'FACILITY',
    },
  },
  vaLocation: {
    preferredFacility: {
      'ui:title': 'Selected VA medical center',
      'ui:widget': DynamicRadioWidget,
      'ui:options': {
        hideLabelText: true,
        // expandUnder: 'FACILITY',
        // expandUnderCondition: true,
        hideIf: formData =>
          get('zipCode', formData) === undefined ||
          get('zipCode', formData).length < 5,
      },
      'ui:reviewWidget': vaLocationReviewWidget,
    },
  },
  'ui:validations': [conditionalValidateBooleanGroup],
};
export const schema = {};
