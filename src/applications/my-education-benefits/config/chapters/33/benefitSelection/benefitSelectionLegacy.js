import React from 'react';
import dateUI from 'platform/forms-system/src/js/definitions/date';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { formFields } from '../../../../constants';
import BenefitRelinquishmentDate from '../../../../components/BenefitRelinquishmentDate';
import BenefitRelinquishedLabel from '../../../../components/BenefitRelinquishedLabel';
import BenefitRelinquishWidget from '../../../../components/BenefitRelinquishWidget';
import DateReviewField from '../../../../components/DateReviewField';

import { ELIGIBILITY } from '../../../../actions';

import { unsureDescription, post911GiBillNote } from '../../../../helpers';

import { validateEffectiveDate } from '../../../../utils/validation';

const { date } = commonDefinitions;

function givingUpBenefitSelected(formData) {
  const benefitRelinquished =
    formData?.[formFields.viewBenefitSelection]?.[
      formFields.benefitRelinquished
    ];
  return ['Chapter30', 'Chapter1606'].includes(benefitRelinquished);
}

function notGivingUpBenefitSelected(formData) {
  return !givingUpBenefitSelected(formData);
}

const benefits = [
  ELIGIBILITY.CHAPTER30,
  ELIGIBILITY.CHAPTER1606,
  'NotEligible',
];

const benefitSelection33 = {
  uiSchema: {
    'view:post911Notice': {
      'ui:description': (
        <>
          {post911GiBillNote}
          <h3>Give up one other benefit</h3>
          <p>
            Because you are applying for the Post-9/11 GI Bill, you have to give
            up one other benefit you may be eligible for.
          </p>
          <p>
            <strong>
              You cannot change your decision after you submit this application.
            </strong>
          </p>
          <va-additional-info trigger="Why do I have to give up a benefit?">
            <p>
              The law says if you are eligible for both the Post-9/11 GI Bill
              and another education benefit based on the same period of active
              duty, you must give one up. One qualifying period of active duty
              can only be used for one VA education benefit.
            </p>
          </va-additional-info>
        </>
      ),
    },
    [formFields.viewBenefitSelection]: {
      'ui:description': (
        <div className="meb-review-page-only">
          <p>
            If you’d like to update which benefit you’ll give up, please edit
            your answers to the questions below.
          </p>
          {post911GiBillNote}
        </div>
      ),
      [formFields.benefitRelinquished]: {
        'ui:title': <BenefitRelinquishedLabel />,
        'ui:widget': BenefitRelinquishWidget,
        'ui:errorMessages': {
          required: 'Please select an answer.',
        },
      },
    },
    'view:activeDutyNotice': {
      'ui:description': (
        <div className="meb-alert meb-alert--mini meb-alert--warning">
          <va-icon size={3} icon="warning" aria-hidden="true" />
          <p className="meb-alert_body">
            <span className="sr-only">Alert:</span> If you give up the
            Montgomery GI Bill Active Duty, you’ll get Post-9/11 GI Bill
            benefits only for the number of months you had left under the
            Montgomery GI Bill Active Duty.
          </p>
        </div>
      ),
      'ui:options': {
        expandUnder: [formFields.viewBenefitSelection],
        hideIf: formData =>
          formData?.[formFields.viewBenefitSelection]?.[
            formFields.benefitRelinquished
          ] !== 'Chapter30',
      },
    },
    [formFields.benefitEffectiveDate]: {
      ...dateUI('Effective date'),
      'ui:options': {
        hideIf: notGivingUpBenefitSelected,
        expandUnder: [formFields.viewBenefitSelection],
      },
      'ui:widget': BenefitRelinquishmentDate,
      'ui:required': givingUpBenefitSelected,
      'ui:reviewField': DateReviewField,
      'ui:validations': [validateEffectiveDate],
    },
    'view:effectiveDateNotes': {
      'ui:description': (
        <div>
          <br />
          <br />
          <ul>
            <li>
              You can select a date up to one year in the past. We may be able
              to pay you benefits for education or training taken during this
              time.
            </li>
            <li>
              We can’t pay for education or training taken more than one year
              before the date of your application for benefits.
            </li>
            <li>
              If you are currently using another benefit, select the date you
              would like to start using the Post-9/11 GI Bill.
            </li>
            <li>
              Be aware that if you enter a date exactly one year prior to this
              date, it will recalculate when you choose the “Finish this
              application later” option and log back in at a later time
            </li>
          </ul>
        </div>
      ),
      'ui:options': {
        hideIf: notGivingUpBenefitSelected,
        expandUnder: [formFields.viewBenefitSelection],
      },
    },
    'view:unsureNote': {
      'ui:description': unsureDescription,
      'ui:options': {
        hideIf: formData =>
          formData?.[formFields.viewBenefitSelection]?.[
            formFields.benefitRelinquished
          ] !== 'NotEligible',
        expandUnder: [formFields.viewBenefitSelection],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:post911Notice': {
        type: 'object',
        properties: {},
      },
      [formFields.viewBenefitSelection]: {
        type: 'object',
        required: [formFields.benefitRelinquished],
        properties: {
          [formFields.benefitRelinquished]: {
            type: 'string',
            enum: benefits,
          },
        },
      },
      'view:activeDutyNotice': {
        type: 'object',
        properties: {},
      },
      [formFields.benefitEffectiveDate]: date,
      'view:effectiveDateNotes': {
        type: 'object',
        properties: {},
      },
      'view:unsureNote': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default benefitSelection33;
