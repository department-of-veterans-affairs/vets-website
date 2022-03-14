import React from 'react';
import _ from 'lodash';

import fullNameUI from 'platform/forms/definitions/fullName';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import currentOrPastMonthYearUI from 'platform/forms-system/src/js/definitions/currentOrPastMonthYear';
import MonthYearUI from 'platform/forms-system/src/js/definitions/monthYear';
import get from 'platform/utilities/data/get';
import CustomReviewField from '../containers/CustomReviewField';
import CustomReviewDOBField from '../containers/CustomReviewDOBField';
import CustomReviewRadio from '../containers/customReviewRadio';
import CustomReviewYesNo from '../containers/customReviewYesNo';
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
          Thank you for your interest in volunteering for coronavirus disease
          research at VA. Please answer the questions below, and we’ll add you
          to our volunteer list. If we think you may be eligible for one of our
          COVID-19 studies, we’ll contact you to tell you more about it so you
          can decide if you want to join. You don’t need to be a Veteran to
          volunteer.
          <p>
            <b>Note:</b> We won’t share your information with anyone outside of
            VA. To learn more before volunteering,{' '}
            <a href="/coronavirus-research">
              read about volunteering for coronavirus research at VA.
            </a>
          </p>
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
  healthHeaderText: {
    'view:healthText': {
      'ui:description': <h2>Help us understand your health</h2>,
    },
  },
  'ui:validations': [conditionalValidateBooleanGroup],
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
  closeContactPositive: {
    'ui:title': (
      <span>
        <strong>
          In the past month, have you been in close contact with anyone who you
          know tested positive for COVID-19?
        </strong>
        <p>
          <strong>Note:</strong> We define close contact as being within 6 feet
          of a person.
        </p>
      </span>
    ),
    'ui:reviewField': CustomReviewRadio,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        YES: 'Yes',
        NO: 'No',
        UNSURE: "I don't know",
      },
      classNames: '',
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
    ...currentOrPastDateUI('Month/Year of 1st dose'),
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
  hospitalized: {
    'ui:title': (
      <span>
        <strong>
          In the past 6 months, have you had to stay overnight in a hospital for
          treatment, care, or testing?
        </strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  smokeOrVape: {
    'ui:title': (
      <span>
        <strong>
          Do you smoke or vape, or do you have a past history of smoking or
          vaping?
        </strong>
      </span>
    ),
    'ui:reviewField': CustomReviewYesNo,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  HEALTH_HISTORY: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>
          Do you have a history of any of the health issues listed below?
        </strong>
        (Please check all that apply.)
        <br />
      </span>
    ),
    'HEALTH_HISTORY::ALLERGY_VACCINE': {
      'ui:title': 'Allergy to any vaccines',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::AUTOIMMUNE_DISEASE': {
      'ui:title': 'Autoimmune disease (like rheumatoid arthritis or lupus)',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::CANCER': {
      'ui:title': 'Cancer',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::IMMUNOCOMPROMISED': {
      'ui:title': 'Compromised immune system (including due to HIV/AIDS)',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::DIABETES': {
      'ui:title': 'Diabetes (Type 1 or 2)',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::HEART_DISEASE': {
      'ui:title': 'Heart disease',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::HIGH_BLOOD_PRESSURE': {
      'ui:title': 'High blood pressure',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::KIDNEY_LIVER_DISEASE': {
      'ui:title': 'Kidney or liver disease',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::LUNG_DISEASE': {
      'ui:title': 'Lung disease',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::STROKE': {
      'ui:title': 'Stroke',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::ANOTHER_SERIOUS_CHRONIC_ILLNESS': {
      'ui:title': 'Another serious chronic (long-term) illness',
      'ui:reviewField': CustomReviewField,
    },
    'HEALTH_HISTORY::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
      'ui:reviewField': CustomReviewField,
    },
  },
  exposureRiskHeaderText: {
    'view:exposureRiskText': {
      'ui:description': <h2>Help us understand your COVID-19 exposure risk</h2>,
    },
  },
  EMPLOYMENT_STATUS: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Which work situation describes you?</strong> (Please check all
        that apply.)
        <br />
      </span>
    ),
    'EMPLOYMENT_STATUS::EMPLOYED_HOME': {
      'ui:title': 'Employed (working from home)',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::EMPLOYED_OUTSIDE_OF_HOME': {
      'ui:title': 'Employed (working outside the home)',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::FRONTLINE_WORKER': {
      'ui:title': 'Frontline health care provider',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::FURLOUGHED_UNEMPLOYED': {
      'ui:title': 'Furloughed or unemployed',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::RETIRED': {
      'ui:title': 'Retired',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::STUDENT': {
      'ui:title': 'Student',
      'ui:reviewField': CustomReviewField,
    },
    'EMPLOYMENT_STATUS::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
      'ui:reviewField': CustomReviewField,
    },
  },
  TRANSPORTATION: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>How do you get to work?</strong> (Please check all that apply.)
        <br />
      </span>
    ),
    'TRANSPORTATION::CAR': {
      'ui:title': 'Car',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::CARPOOL_OR_VANPOOL': {
      'ui:title': 'Carpool or vanpool',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::FREQUENT_AIR_TRAVEL': {
      'ui:title': 'Frequent air travel',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::PUBLIC_TRANSPORT': {
      'ui:title': 'Public transportation (bus, train, subway)',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::WALK_BIKE': {
      'ui:title': 'Walk or bike',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::WORK_FROM_HOME': {
      'ui:title': 'Work from home',
      'ui:reviewField': CustomReviewField,
    },
    'TRANSPORTATION::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
      'ui:reviewField': CustomReviewField,
    },
  },
  residentsInHome: {
    'ui:title': (
      <span>
        <strong>How many people, including you, live in your home?</strong>
      </span>
    ),
    'ui:widget': 'radio',
    'ui:reviewField': CustomReviewRadio,
    'ui:options': {
      labels: {
        ONE_TWO: '1 to 2',
        THREE_FIVE: '3 to 5',
        SIX_TEN: '6 to 10',
        MORE_THAN_TEN: 'More than 10',
      },
      classNames: '',
    },
  },
  closeContact: {
    'ui:title': (
      <span>
        <strong>
          On most days, how many people do you have close contact with outside
          of those who live in your home?
        </strong>
        <p>
          <strong>Note:</strong> We define close contact as being within 6 feet
          of a person.
        </p>
      </span>
    ),
    'ui:reviewField': CustomReviewRadio,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        ZERO: '0',
        ONE_TEN: '1 to 10',
        ELEVEN_THIRTY: '11 to 30',
        THIRTYONE_FIFTY: '31 to 50',
        MORE_THAN_FIFTY: 'More than 50',
      },
      classNames: '',
    },
  },
  contactHeaderText: {
    'view:contactText': {
      'ui:description': <h2>Your contact and personal information</h2>,
    },
  },
  veteranFullName: _.merge(fullNameUI, {
    first: {
      'ui:title': 'First name',
    },
    last: {
      'ui:title': 'Last name',
    },
    middle: {
      'ui:title': 'Middle name',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        hideEmptyValueInReview: true,
      },
    },
    'ui:order': ['first', 'middle', 'last', 'suffix'],
  }),
  email: emailUI(),
  phone: {
    ...phoneUI(),
    'ui:options': {
      classNames: 'input-width',
    },
  },
  veteranDateOfBirth: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:description': (
      <span>
        <strong>Note:</strong> You must be at least 18 years old to participate
        in research.
      </span>
    ),
    'ui:reviewField': CustomReviewDOBField,
  },
  zipCode: {
    'ui:title': 'Zip code where you currently live',
    'ui:errorMessages': {
      required: 'Please enter a zip code',
      pattern: 'Please enter a valid 5- or 9-digit zip code (dashes allowed)',
    },
    'ui:options': {
      classNames: 'input-width',
    },
  },
  VETERAN: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Which of these best describe you?</strong> (Please check all
        that apply.)
        <br />
        <p>
          <strong>Note:</strong> We ask for this information to help us
          understand your relationship with VA.
        </p>
      </span>
    ),
    'VETERAN::VETERAN': {
      'ui:title': 'Veteran',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::ACTIVE_DUTY': {
      'ui:title': 'Active-duty service member',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::NATIONAL_GUARD_RESERVES': {
      'ui:title': 'Member of the National Guard or Reserve',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::VA_EMPLOYEE': {
      'ui:title': 'VA employee',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::FAMILY_MEMBER_CAREGIVER': {
      'ui:title': 'Family member or caregiver of a Veteran or service member',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::VA_HEALTHCARE_CHAMPVA': {
      'ui:title': 'Enrolled in VA health care or CHAMPVA',
      'ui:reviewField': CustomReviewField,
    },
    'VETERAN::NONE_OF_ABOVE': {
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
          get('zipCode', formData).length < 5 ||
          !formData.FACILITY,
      },
      'ui:reviewWidget': vaLocationReviewWidget,
      'ui:required': formData =>
        get('zipCode', formData) !== undefined &&
        get('zipCode', formData).length >= 5 &&
        formData.FACILITY,
    },
  },
  GENDER: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },

    'ui:title': (
      <span>
        <strong>What is your gender?</strong> (Please check all that apply.)
        <br />
        <br />
        <strong>Note:</strong> We ask for this information to help make sure we
        include a diverse range of people in our research studies.
        <br />
      </span>
    ),
    'GENDER::MALE': {
      'ui:title': 'Man',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::FEMALE': {
      'ui:title': 'Woman',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::TRANSGENDER_MALE': {
      'ui:title': 'Transgender man',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::TRANSGENDER_FEMALE': {
      'ui:title': 'Transgender woman',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::NON_BINARY': {
      'ui:title': 'Non-binary',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::SELF_IDENTIFY': {
      'ui:title': 'Prefer to self-describe',
      'ui:reviewField': CustomReviewField,
    },
    'GENDER::NONE_OF_ABOVE': {
      'ui:title': 'Prefer not to answer',
      'ui:reviewField': CustomReviewField,
    },
  },
  GENDER_SELF_IDENTIFY_DETAILS: {
    'ui:title': 'Provide your preferred description',
    'ui:options': {
      expandUnder: 'GENDER',
      expandUnderCondition: formData =>
        formData !== undefined && formData['GENDER::SELF_IDENTIFY'] === true,
    },
  },
  RACE_ETHNICITY: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>What is your race, ethnicity, or origin?</strong> (Please check
        all that apply.)
        <br />
        <br />
        <strong>Note:</strong> We ask for this information to help make sure we
        include a diverse range of people in our research studies.
      </span>
    ),
    'RACE_ETHNICITY::AMERICAN_INDIAN_ALASKA_NATIVE': {
      'ui:title': 'American Indian or Alaska Native',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::ASIAN': {
      'ui:title': 'Asian',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::BLACK_AFRICAN_AMERICAN': {
      'ui:title': 'Black or African American',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::HISPANIC_LATINO_SPANISH_ORIGIN': {
      'ui:title': 'Hispanic, Latino, or Spanish origin',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::HAWAIIAN_PACIFIC_ISLANDER': {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::WHITE': {
      'ui:title': 'White',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::OTHER_RACE_ETHNICITY': {
      'ui:title': 'Another race or ethnicity',
      'ui:reviewField': CustomReviewField,
    },
    'RACE_ETHNICITY::NONE_OF_ABOVE': {
      'ui:title': 'Prefer not to answer',
      'ui:reviewField': CustomReviewField,
    },
  },
};
export const schema = {};
