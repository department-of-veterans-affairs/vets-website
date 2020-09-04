import React from 'react';
import _ from 'lodash';

import fullNameUI from 'platform/forms/definitions/fullName';
import HeightWidget from '../widgets/HeightWidget';
import WeightWidget from '../widgets/WeightWidget';

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
          Thank you for your interest in participating in coronavirus research
          at VA. Please answer the questions below, and we’ll add you to our
          volunteer list. If we think you may be eligible for one of our
          COVID-19 studies, we’ll contact you to tell you more about it so you
          can decide if you want to join. You don’t need to be a Veteran to
          volunteer.
          <p>
            <b>Note:</b> We won’t share your information with anyone outside of
            VA. To learn more before volunteering, read about{' '}
            <a href="/coronavirus-research">
              participating in coronavirus research at VA
            </a>
            .
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
        <strong>Have you ever been diagnosed with COVID-19?</strong>
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
        <p>
          <strong>Note:</strong> We define close contact as being within 6 feet
          of a person.
        </p>
      </span>
    ),
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
          In the past 6 months, have you had to stay overnight in a hospital for
          treatment, care, or testing?
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
        (Please check all that apply)
        <br />
      </span>
    ),
    'HEALTH_HISTORY::ALLERGY_VACCINE': {
      'ui:title': 'Allergy to any vaccines',
    },
    'HEALTH_HISTORY::AUTOIMMUNE_DISEASE': {
      'ui:title': 'Autoimmune disease (like rheumatoid arthritis or lupus)',
    },
    'HEALTH_HISTORY::CANCER': {
      'ui:title': 'Cancer',
    },
    'HEALTH_HISTORY::IMMUNOCOMPROMISED': {
      'ui:title': 'Compromised immune system (including due to HIV/AIDS)',
    },
    'HEALTH_HISTORY::DIABETES': {
      'ui:title': 'Diabetes (Type 1 or 2)',
    },
    'HEALTH_HISTORY::HEART_DISEASE': {
      'ui:title': 'Heart disease',
    },
    'HEALTH_HISTORY::HIGH_BLOOD_PRESSURE': {
      'ui:title': 'High blood pressure',
    },
    'HEALTH_HISTORY::KIDNEY_LIVER_DISEASE': {
      'ui:title': 'Kidney or liver disease',
    },
    'HEALTH_HISTORY::LUNG_DISEASE': {
      'ui:title': 'Lung disease',
    },
    'HEALTH_HISTORY::STROKE': {
      'ui:title': 'Stroke',
    },
    'HEALTH_HISTORY::ANOTHER_SERIOUS_CHRONIC_ILLNESS': {
      'ui:title': 'Another serious chronic (long-term) illness',
    },
    'HEALTH_HISTORY::NONE_OF_ABOVE': {
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
  EMPLOYMENT_STATUS: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Which work situation describes you?</strong> (Please check all
        that apply)
        <br />
      </span>
    ),
    'EMPLOYMENT_STATUS::EMPLOYED_HOME': {
      'ui:title': 'Employed (working from home)',
    },
    'EMPLOYMENT_STATUS::EMPLOYED_OUTSIDE_OF_HOME': {
      'ui:title': 'Employed (working outside the home)',
    },
    'EMPLOYMENT_STATUS::FRONTLINE_WORKER': {
      'ui:title': 'Frontline health care provider',
    },
    'EMPLOYMENT_STATUS::FURLOUGHED_UNEMPLOYED': {
      'ui:title': 'Furloughed or unemployed',
    },
    'EMPLOYMENT_STATUS::RETIRED': {
      'ui:title': 'Retired',
    },
    'EMPLOYMENT_STATUS::STUDENT': {
      'ui:title': 'Student',
    },
    'EMPLOYMENT_STATUS::NONE_OF_ABOVE': {
      'ui:title': 'None of the above',
    },
  },
  TRANSPORTATION: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>How do you get to work?</strong> (Please check all that apply)
        <br />
      </span>
    ),
    'TRANSPORTATION::CAR': {
      'ui:title': 'Car',
    },
    'TRANSPORTATION::FREQUENT_AIR_TRAVEL': {
      'ui:title': 'Frequent air travel',
    },
    'TRANSPORTATION::PUBLIC_TRANSPORT': {
      'ui:title': 'Public transporation (bus, train, subway)',
    },
    'TRANSPORTATION::WALK_BIKE': {
      'ui:title': 'Walk or bike',
    },
    'TRANSPORTATION::WORK_FROM_HOME': {
      'ui:title': 'Work from home',
    },
    'TRANSPORTATION::NONE_OF_ABOVE': {
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
        <p>
          <strong>Note:</strong> We define close contact as being within 6 feet
          of a person.
        </p>
      </span>
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
  },
  zipCode: {
    'ui:title': 'Zip code',
    'ui:errorMessages': {
      required: 'Please enter a zip code',
      pattern: 'Please enter a valid 5- or 9-digit zip code (dashes allowed)',
    },
    'ui:options': {
      classNames: 'input-width',
    },
  },
  height: {
    'ui:title': 'Height',
    'ui:widget': HeightWidget,
    'ui:errorMessages': {
      required: 'Please enter your height',
      pattern: 'Please enter a valid height (feet and inches)',
    },
  },
  weight: {
    'ui:title': 'Weight',
    'ui:widget': WeightWidget,
    'ui:errorMessages': {
      required: 'Please enter your weight',
      pattern: 'Please enter a valid weight (decimals allowed)',
    },
  },
  GENDER: {
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
    },
    'ui:title': (
      <span>
        <strong>Current gender identity</strong> (Please check all that apply)
        <br />
        <br />
        <strong>Note:</strong> We ask for this information to help make sure we
        include a diverse range of people in our research studies.
        <br />
      </span>
    ),
    'GENDER::FEMALE': {
      'ui:title': 'Female',
    },
    'GENDER::MALE': {
      'ui:title': 'Male',
    },
    'GENDER::TRANSGENDER_FEMALE': {
      'ui:title': 'Transgender female',
    },
    'GENDER::TRANSGENDER_MALE': {
      'ui:title': 'Transgender male',
    },
    'GENDER::GENDER_VARIANT': {
      'ui:title':
        'Gender variant/nonbinary (neither exclusively female nor male)',
    },
    'GENDER::SELF_IDENTIFY': {
      'ui:title': 'Prefer to self-identify',
    },
    'GENDER::NONE_OF_ABOVE': {
      'ui:title': 'Prefer not to answer',
    },
  },
  RACE_ETHNICITY_ORIGIN: {
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
    'RACE_ETHNICITY_ORIGIN::AMERICAN_INDIAN_ALASKA_NATIVE': {
      'ui:title': 'American Indian or Alaska Native',
    },
    'RACE_ETHNICITY_ORIGIN::ASIAN': {
      'ui:title': 'Asian',
    },
    'RACE_ETHNICITY_ORIGIN::BLACK_AFRICAN_AMERICAN': {
      'ui:title': 'Black or African American',
    },
    'RACE_ETHNICITY_ORIGIN::HISPANIC_LATINO_SPANISH_ORIGIN': {
      'ui:title': 'Hispanic, Latino, or Spanish origin',
    },
    'RACE_ETHNICITY_ORIGIN::HAWAIIAN_PACIFIC_ISLANDER': {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
    },
    'RACE_ETHNICITY_ORIGIN::WHITE': {
      'ui:title': 'White',
    },
    'RACE_ETHNICITY_ORIGIN::OTHER_RACE_ETHNICITY': {
      'ui:title': 'Another race or ethnicity',
    },
    'RACE_ETHNICITY_ORIGIN::NONE_OF_ABOVE': {
      'ui:title': 'Prefer not to answer',
    },
  },
};
export const schema = {};
