import React from 'react';
import _ from 'lodash';
import fullNameUI from 'platform/forms/definitions/fullName';

import {
  validateMatch,
  validateBooleanGroup,
} from 'platform/forms-system/src/js/validation';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

export const uiSchema = {
  'ui:validations': [validateMatch('email', 'view:confirmEmail')],
  descriptionText: {
    'view:descriptionText': {
      'ui:description': (
        <span>
          Thank you for your interest in volunteering for COVID-19 research. If
          you’re a U.S. Veteran, please answer the questions below and we’ll add
          you to our VA volunteer registry. If we think you may meet the
          criteria for a research study, we’ll contact you for a phone
          interview.
          <p>
            <b>Note:</b> We won’t share your information with anyone outside of
            VA. If you're not a Veteran, you can volunteer through the COVID-19
            Prevention Network.
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
      'ui:description': <span>Help us understand your health</span>,
    },
    'ui:options': {
      classNames:
        'schemaform-block-title schemaform-block-subtitle vads-u-margin-top--3 vads-u-font-size--h2',
    },
  },
  diagnosed: {
    'ui:title': (
      <span>
        <strong>Have ever been diagnosed with COVID-19?</strong>
      </span>
    ),
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  closeContactPositive: {
    'ui:title': (
      <span>
        <strong>
          In the past month, have you been in close contact with anyone who
          tested positive for COVID-19?
        </strong>
      </span>
    ),
    'ui:description':
      'We define close contact as being within 6 feet of a person.',
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
  hospitalized: {
    'ui:title': (
      <span>
        <strong>
          In the past 6 months, have you been hospitalized at any time?
        </strong>
      </span>
    ),
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
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: '',
    },
  },
  healthHistory: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>
          Do you have a history of any of the health issues listed below?
        </strong>
        <br />
        Please check all that apply.
      </span>
    ),
    ALLERGY_VACCINE: {
      'ui:title': 'Allergy to any vaccines',
    },
    AUTOIMMUNE_DISEASE: {
      'ui:title': 'Autoimmune disease (like rheumatoid arthritis or lupus)',
    },
    CANCER: {
      'ui:title': 'Cancer',
    },
    DIABETES: {
      'ui:title': 'Diabetes (Type 1 or 2)',
    },
    HEART_DISEASE: {
      'ui:title': 'Heart disease',
    },
    HIGH_BLOOD_PRESSURE: {
      'ui:title': 'High blood pressure',
    },
    IMMUNOCOMPROMISED: {
      'ui:title': 'Compromised immune system (including due to HIV/AIDS)',
    },
    KIDNEY_LIVER_DISEASE: {
      'ui:title': 'Kidney or liver disease',
    },
    LUNG_DISEASE: {
      'ui:title': 'Lung disease',
    },
    STROKE: {
      'ui:title': 'Stroke',
    },
    ANOTHER_SERIOUS_CHRONIC_ILLNESS: {
      'ui:title': 'Another serious chronic (long-term) illness',
    },
    NONE_OF_ABOVE: {
      'ui:title': 'None of the above',
    },
  },
  exposureRiskHeaderText: {
    'view:exposureRiskText': {
      'ui:description': 'Help us understand your COVID-19 exposure risk',
      'ui:options': {
        classNames:
          'schemaform-block-title schemaform-block-subtitle vads-u-margin-top--3 vads-u-margin-bottom--neg2 vads-u-font-size--h2',
      },
    },
  },
  employmentStatus: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>
          Which work situation describes you? (Please check all that apply)
        </strong>
        <br />
        Please check all that apply.
      </span>
    ),
    EMPLOYED_HOME: {
      'ui:title': 'Employed (working from home)',
    },
    EMPLOYED_OUTSIDE_OF_HOME: {
      'ui:title': 'Employed (working outside the home)',
    },
    FRONTLINE_WORKER: {
      'ui:title': 'Frontline health care provider',
    },
    FURLOUGHED_UNEMPLOYED: {
      'ui:title': 'Furloughed or unemployed',
    },
    RETIRED: {
      'ui:title': 'Retired',
    },
    STUDENT: {
      'ui:title': 'Student',
    },
    NONE_OF_ABOVE: {
      'ui:title': 'None of the above',
    },
  },
  transportation: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>How do you get to work?</strong>
        <br />
        Please check all that apply.
      </span>
    ),
    CAR: {
      'ui:title': 'Car',
    },
    FREQUENT_AIR_TRAVEL: {
      'ui:title': 'Frequent air travel',
    },
    PUBLIC_TRANSPORT: {
      'ui:title': 'Public transporation (bus, train, subway)',
    },
    WALK_BIKE: {
      'ui:title': 'Walk or bike',
    },
    WORK_FROM_HOME: {
      'ui:title': 'Work from home',
    },
    NONE_OF_ABOVE: {
      'ui:title': 'None of the above',
    },
  },
  residentsInHome: {
    'ui:title': (
      <span>
        <strong>How many people live in your home?</strong>
      </span>
    ),
    'ui:widget': 'radio',
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
      </span>
    ),
    'ui:description': (
      <span>We define close contact as being within 6 feet of a person.</span>
    ),
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
      'ui:description': 'Your contact and personal information',
      'ui:options': {
        classNames:
          'schemaform-block-title schemaform-block-subtitle vads-u-margin-top--3 vads-u-font-size--h2',
      },
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
    },
    suffix: {
      'ui:title': 'Suffix',
    },
    'ui:order': ['first', 'middle', 'last', 'suffix'],
  }),
  email: emailUI(),
  'view:confirmEmail': emailUI('Re-enter email address'),
  phone: phoneUI(),
  veteranDateOfBirth: {
    ...currentOrPastDateUI('Date of birth'),
    'ui:description':
      'Note: You must be at least 18 years old to participate in research.',
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:errorMessages': {
      required: 'Please enter a zip code',
      pattern: 'Please enter a valid 5- or 9-digit zip code (dashes allowed)',
    },
    'ui:options': {
      classNames: '',
    },
  },
  weight: {
    'ui:title': 'Weight',
    'ui:options': {
      classNames: ' ',
    },
    'ui:errorMessages': {
      required: 'Please enter your weight',
      pattern: 'Please enter a valid weight (decimals allowed)',
    },
  },
  gender: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Current gender identity</strong>
        <br />
        <br />
        <strong>Note:</strong> We ask for this information to help make sure we
        include a diverse range of people in our research studies.
        <br />
        <br />
        please check all that apply
      </span>
    ),
    FEMALE: {
      'ui:title': 'Female',
    },
    MALE: {
      'ui:title': 'Male',
    },
    TRANSGENDER_FEMALE: {
      'ui:title': 'Transgender female',
    },
    TRANSGENDER_MALE: {
      'ui:title': 'Transgender male',
    },
    GENDER_VARIANT: {
      'ui:title':
        'Gender variant/nonbinary (neither exclusively female nor male)',
    },
    SELF_IDENTIFY: {
      'ui:title': 'Prefer to self-identify',
    },
    NONE_OF_ABOVE: {
      'ui:title': 'Prefer not to answer',
    },
  },
  raceEthnicityOrigin: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Race, ethnicity, and origin</strong> (Please check all that
        apply)
        <br />
        <br />
        <strong>Note:</strong> We ask for this information to help make sure we
        include a diverse range of people in our research studies.
      </span>
    ),
    AMERICAN_INDIAN_ALASKA_NATIVE: {
      'ui:title': 'American Indian or Alaska Native',
    },
    ASIAN: {
      'ui:title': 'Asian',
    },
    BLACK_AFRICAN_AMERICAN: {
      'ui:title': 'Black or African American',
    },
    HISPANIC_LATINO_SPANISH_ORIGIN: {
      'ui:title': 'Hispanic, Latino, or Spanish origin',
    },
    HAWAIIAN_PACIFIC_ISLANDER: {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
    },
    WHITE: {
      'ui:title': 'White',
    },
    OTHER_RACE_ETHNICITY: {
      'ui:title': 'Another race or ethnicity',
    },
    NONE_OF_ABOVE: {
      'ui:title': 'Prefer not to answer',
    },
  },
};
export const schema = {};
