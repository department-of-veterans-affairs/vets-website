import React from 'react';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import CustomReviewDOBField from '../../../components/CustomReviewDOBField';

import ApplicantIdentityView from '../../../components/ApplicantIdentityView';
import { formFields } from '../../../constants';

const { fullName, date } = commonDefinitions;

function isValidName(str) {
  return str && /^[A-Za-z][A-Za-z ']*$/.test(str);
}

function isValidLastName(str) {
  return str && /^[A-Za-z][A-Za-z '-]*$/.test(str);
}

const applicantInformation33 = {
  uiSchema: {
    'view:subHeadings': {
      'ui:description': (
        <>
          <h3>Review your personal information</h3>
          <p>
            This is the personal information we have on file for you. If you
            notice any errors, please correct them now. Any updates you make
            will change the information for your education benefits only.
          </p>
          <p>
            <strong>Note:</strong> If you want to update your personal
            information for other VA benefits, you can do that from your
            profile.
          </p>
          <p>
            <a href="/profile/personal-information">Go to your profile</a>
          </p>
        </>
      ),
      'ui:options': {
        hideIf: formData => formData.showMebEnhancements06,
      },
    },
    [formFields.formId]: {
      'ui:title': 'Form ID',
      'ui:disabled': true,
      'ui:options': {
        hideOnReview: true,
      },
    },
    [formFields.claimantId]: {
      'ui:title': 'Claimant ID',
      'ui:disabled': true,
      'ui:options': {
        hideOnReview: true,
      },
    },
    'view:applicantInformation': {
      'ui:options': {
        hideIf: formData => !formData.showMebEnhancements06,
      },
      'ui:description': (
        <>
          <ApplicantIdentityView />
        </>
      ),
    },
    [formFields.viewUserFullName]: {
      'ui:options': {
        hideIf: formData => formData.showMebEnhancements06,
      },
      'ui:description': (
        <>
          <p className="meb-review-page-only">
            If you’d like to update your personal information, please edit the
            form fields below.
          </p>
        </>
      ),
      [formFields.userFullName]: {
        'ui:options': {
          hideIf: formData => formData.showMebEnhancements06,
        },
        'ui:required': formData => !formData?.showMebEnhancements06,
        ...fullNameUI,
        first: {
          ...fullNameUI.first,
          'ui:options': {
            hideIf: formData => formData.showMebEnhancements06,
          },
          'ui:title': 'Your first name',
          'ui:required': formData => !formData?.showMebEnhancements06,
          'ui:validations': [
            (errors, field) => {
              if (!isValidName(field)) {
                if (field.length === 0) {
                  errors.addError('Please enter your first name');
                } else if (field[0] === ' ' || field[0] === "'") {
                  errors.addError(
                    'First character must be a letter with no leading space.',
                  );
                } else {
                  errors.addError(
                    'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                  );
                }
              }
            },
          ],
        },
        last: {
          ...fullNameUI.last,
          'ui:title': 'Your last name',
          'ui:options': {
            hideIf: formData => formData.showMebEnhancements06,
          },
          'ui:required': formData => !formData?.showMebEnhancements06,
          'ui:validations': [
            (errors, field) => {
              if (!isValidLastName(field)) {
                if (field.length === 0) {
                  errors.addError('Please enter your last name');
                } else if (
                  field[0] === ' ' ||
                  field[0] === "'" ||
                  field[0] === '-'
                ) {
                  errors.addError(
                    'First character must be a letter with no leading space.',
                  );
                } else {
                  errors.addError(
                    'Please enter a valid entry. Acceptable entries are letters, spaces, dashes and apostrophes.',
                  );
                }
              }
            },
          ],
        },
        middle: {
          ...fullNameUI.middle,
          'ui:title': 'Your middle name',
          'ui:options': {
            hideIf: formData => formData.showMebEnhancements06,
          },
          'ui:required': formData => !formData?.showMebEnhancements06,
          'ui:validations': [
            (errors, field) => {
              if (!isValidName(field)) {
                if (field.length === 0) {
                  errors.addError('Please enter your middle name');
                } else if (field[0] === ' ' || field[0] === "'") {
                  errors.addError(
                    'First character must be a letter with no leading space.',
                  );
                } else {
                  errors.addError(
                    'Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
                  );
                }
              }
            },
          ],
        },
      },
    },
    [formFields.dateOfBirth]: {
      'ui:options': {
        hideIf: formData => formData.showMebEnhancements06,
      },
      'ui:required': formData => !formData?.showMebEnhancements06,
      ...currentOrPastDateUI('Your date of birth'),
      'ui:reviewField': CustomReviewDOBField,
    },
  },
  schema: {
    type: 'object',
    required: [formFields.dateOfBirth],
    properties: {
      [formFields.formId]: {
        type: 'string',
      },
      [formFields.claimantId]: {
        type: 'integer',
      },
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      [formFields.viewUserFullName]: {
        // required: [formFields.userFullName],
        type: 'object',
        properties: {
          [formFields.userFullName]: {
            ...fullName,
            properties: {
              ...fullName.properties,
              first: {
                ...fullName.properties.first,
                maxLength: 20,
              },
              middle: {
                ...fullName.properties.middle,
                maxLength: 20,
              },
              last: {
                ...fullName.properties.last,
                maxLength: 26,
              },
            },
          },
        },
      },
      [formFields.dateOfBirth]: date,
      'view:applicantInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default applicantInformation33;
