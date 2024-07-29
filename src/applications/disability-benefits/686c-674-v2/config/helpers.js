import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const isChapterFieldRequired = (formData, option) =>
  formData[`view:selectable686Options`][option];

export const VerifiedAlert = (
  <div>
    <div className="usa-alert usa-alert-info schemaform-sip-alert">
      <div className="usa-alert-body">
        <strong>Note:</strong> Since you’re signed in to your account and your
        account is verified, we can prefill part of your application based on
        your account details. You can also save your form in progress and come
        back later to finish filling it out.
      </div>
    </div>
    <br />
  </div>
);

export const VaFileNumberMissingAlert = (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      Your profile is missing some required information
    </h2>
    <p className="vads-u-font-size--base">
      The personal information we have on file for your is missing your VA file
      number.
    </p>
    <p className="vads-u-font-size--base">
      You’ll need to update your personal information. Call Veterans Benefits
      Assistance at <va-telephone contact="8008271000" /> between 8:00 a.m. and
      9:00 p.m. ET Monday through Friday.
    </p>
  </>
);

export const ServerErrorAlert = (
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
    <p className="vads-u-font-size--base">
      If you get this error again, call the VA.gov help desk at{' '}
      <va-telephone contact={CONTACTS.VA_311} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </>
);

export const certificateNotice = () => (
  <p className="vads-u-font-size--base">
    You’ll need to submit a copy of your marriage certificate or a church record
    of your marriage. We’ll ask you to submit this document at the end of the
    form
  </p>
);

export const isInsideListLoopReturn = (
  chapter,
  outerField,
  uiTitle,
  formChapter,
  countryUiLabel,
  stateUiLabel,
  cityUiLabel,
) => {
  return {
    'ui:title': uiTitle,
    isOutsideUs: {
      'ui:title': 'This occurred outside the U.S.',
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    country: {
      'ui:title': countryUiLabel,
      'ui:required': (formData, index) =>
        formData?.[chapter]?.[`${index}`]?.[outerField]?.isOutsideUs,
      'ui:options': {
        hideIf: (formData, index) => {
          if (!formData?.[chapter]?.[`${index}`]?.[outerField]?.isOutsideUs) {
            return true;
          }
          return false;
        },
      },
    },
    state: {
      'ui:title': stateUiLabel,
      'ui:required': (formData, index) =>
        !formData?.[chapter]?.[`${index}`]?.[outerField]?.isOutsideUs,
      'ui:options': {
        hideIf: (formData, index) => {
          if (formData?.[chapter]?.[`${index}`]?.[outerField]?.isOutsideUs) {
            return true;
          }
          return false;
        },
      },
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, formChapter),
      'ui:title': cityUiLabel,
    },
  };
};

export const isOutsideListLoopReturn = (
  chapter,
  outerField,
  uiTitle,
  formChapter,
  countryUiLabel,
  stateUiLabel,
  cityUiLabel,
) => {
  return {
    'ui:title': uiTitle,
    isOutsideUs: {
      'ui:title': 'This occurred outside the U.S.',
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    country: {
      'ui:title': countryUiLabel,
      'ui:required': formData => formData?.[chapter]?.[outerField]?.isOutsideUs,
      'ui:options': {
        hideIf: formData => {
          if (!formData?.[chapter]?.[outerField]?.isOutsideUs) {
            return true;
          }
          return false;
        },
      },
    },
    state: {
      'ui:title': stateUiLabel,
      'ui:required': formData =>
        !formData?.[chapter]?.[outerField]?.isOutsideUs,
      'ui:options': {
        hideIf: formData => {
          if (formData?.[chapter]?.[outerField]?.isOutsideUs) {
            return true;
          }
          return false;
        },
      },
    },
    city: {
      'ui:required': formData => isChapterFieldRequired(formData, formChapter),
      'ui:title': cityUiLabel,
    },
  };
};

export const hoursPerWeekUiSchema = {
  'ui:title': 'Hours a week',
  'ui:options': {
    widgetClassNames: 'form-select-medium',
  },
  'ui:errorMessages': { required: 'Enter a number' },
  'ui:validations': [
    (errors, fieldData) => {
      if (fieldData > 168) {
        errors.addError('Enter a number less than 169');
      }
    },
  ],
};

export const classesPerWeekUiSchema = {
  'ui:title': 'Number of sessions a week',
  'ui:options': {
    widgetClassNames: 'form-select-medium',
  },
  'ui:errorMessages': { required: 'Enter a number' },
  'ui:validations': [
    (errors, fieldData) => {
      if (fieldData > 999) {
        errors.addError('Enter a number less than 1000');
      }
    },
  ],
};

export const PensionIncomeRemovalQuestionTitle = (
  <p>
    Did this dependent earn an income in the last 365 days? Answer this question{' '}
    <strong>only</strong> if you are removing this dependent from your{' '}
    <strong>pension</strong>.
  </p>
);

export const generateTitle = text => {
  return <h3 className="vads-u-margin-top--0 vads-u-color--base">{text}</h3>;
};
