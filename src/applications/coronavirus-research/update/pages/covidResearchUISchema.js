import React from 'react';

import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import CustomReviewField from '../containers/CustomReviewField';
import CustomReviewRadio from '../containers/customReviewRadio';
import CustomReviewYesNo from '../containers/customReviewYesNo';
import get from 'platform/utilities/data/get';

const conditionalValidateBooleanGroup = (errors, pageData) => {
  const { diagnosed, DIAGNOSED_DETAILS } = pageData;
  if (diagnosed) {
    validateBooleanGroup(errors.DIAGNOSED_DETAILS, DIAGNOSED_DETAILS);
  }
  const {
    vaccinated,
    VACCINATED_PLAN,
    VACCINATED_DETAILS,
    VACCINATED_SECOND,
    VACCINATED_DATE1,
    VACCINATED_DATE2,
  } = pageData;
  if (vaccinated) {
    validateBooleanGroup(errors.VACCINATED_PLAN, VACCINATED_PLAN);
    validateBooleanGroup(errors.VACCINATED_DETAILS, VACCINATED_DETAILS);
    validateBooleanGroup(errors.VACCINATED_SECOND, VACCINATED_SECOND);
    validateBooleanGroup(errors.VACCINATED_DATE1, VACCINATED_DATE1);
    validateBooleanGroup(errors.VACCINATED_DATE2, VACCINATED_DATE2);
  }
};

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
  },
  VACCINATED_DETAILS: {
    'ui:title': (
      <span>
        <strong>Which vaccine did you receive?</strong>
      </span>
    ),
    'ui:reviewField': CustomReviewRadio,
    'ui:widget': 'radio',
    'ui:options': {
      showFieldLabel: true,
      expandUnder: 'vaccinated',
      expandUnderCondition: true,
      classNames: '',
      enum: [
        'Moderna',
        'Pfizer',
        'Johnson & Johnson',
        'Novavax',
        'Astra Zeneca',
        "Don't know/Don't remember",
      ],
    },
  },
  VACCINATED_DATE1: {
    ...currentOrPastDateUI('Month/Year of 1st dose'),
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData => get('VACCINATED_DETAILS', formData) === undefined,
      classNames: '',
    },
  },
  VACCINATED_DATE2: {
    ...currentOrPastDateUI(
      'Month/Year of 2nd dose (or future date if scheduled)',
    ),
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_DETAILS', formData) === undefined ||
        get('VACCINATED_DETAILS', formData) === 'Johnson & Johnson',
      classNames: '',
    },
  },
  VACCINATED_SECOND: {
    'ui:title': <span>Did not get second dose</span>,
    'ui:options': {
      expandUnder: 'vaccinated',
      hideIf: formData =>
        get('VACCINATED_DETAILS', formData) === undefined ||
        get('VACCINATED_DETAILS', formData) === 'Johnson & Johnson',
      classNames: '',
    },
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
    'ui:title': 'Zip code where you currently live',
    'ui:errorMessages': {
      required: 'Please enter a zip code',
      pattern: 'Please enter a valid 5- or 9-digit zip code (dashes allowed)',
    },
    'ui:options': {
      classNames: 'input-width',
    },
  },
};
export const schema = {};
