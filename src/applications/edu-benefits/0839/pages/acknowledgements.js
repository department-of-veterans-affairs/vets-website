import React from 'react';
import {
  titleUI,
  textUI,
  checkboxUI,
  checkboxRequiredSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CapitalizedTextInputField from '../containers/CapitalizedTextInputField';
import { validateInitials } from '../helpers';

const STATEMENT_1 =
  'For all U.S. schools, once this agreement is accepted by VA, it will be considered an open-ended agreement that is in effect for the entire upcoming academic year and all future academic years unless VA or the institution notifies the other party that changes are requested during the the annual open season enrollment period, March 15 - May 15 (or the following Monday if May 15 falls on a Saturday or Sunday.) The annual open season enrollment period for foreign schools is June 1 - July 31 (or the following Monday if if July 31 falls on a Saturday or Sunday.) Withdrawal or modifications to the terms shall be indicated in Agreement Type. Modifications made during the open enrollment period will go into effect for the subsequent academic year and will be posted to our website at www.gibill.va.gov when the open enrollment period ends. ';
const STATEMENT_2 =
  'The IHL agrees to provide contributions to eligible individuals who apply for such program at the institution (in a manner prescribed by the institution) on a first-come-first-serve basis. Funds for Yellow Ribbon contributions may derive from any source of institutional funding that is not already allocated or awarded for a non-Yellow Ribbon purpose. Student ledgers must denote contributions as "Yellow Ribbon." Yellow Ribbon funds cannot be denoted as any type of grant, scholarship or other fund sources that would be applied to the student\'s account regardless of Yellow Ribbon program participation.';
const STATEMENT_3 =
  "The IHL agrees to provide contributions on behalf of a participating individual during the current academic year and all subsequent academic years in which the IHL participates in the Yellow Ribbon Program, provided that the individual maintains satisfactory progress, conduct, and attendance according to the regularly prescribed standards of the institution. If modification to the existing agreement reduces the contribution amount, the IHL agrees to maintain the prior agreement's contribution amount for any individuals in good standing who were in receipt of Yellow Ribbon for prior academic years. ";
const STATEMENT_4 =
  'The IHL agrees to provide the maximum amount of contributions payable toward the net cost for each participating individual during each term, quarter, or semester does not exceed the maximum dollar amount payable during the academic year. ';

const validateInitialsMatch = (errors, fieldData, formData) => {
  const firstName = formData?.authorizedOfficial?.fullName?.first || '';
  const lastName = formData?.authorizedOfficial?.fullName?.last || '';
  const capitalizedValue = fieldData ? fieldData.toUpperCase() : '';

  const error = validateInitials(capitalizedValue, firstName, lastName);
  if (error) {
    errors.addError(error);
  }
};

const uiSchema = {
  ...titleUI(
    'Initial each statement to acknowledge the Yellow Ribbon Program terms',
  ),
  'view:additionalInstructions': {
    'ui:description': (
      <va-link
        text="Review additional instructions for the Yellow Ribbon Program Agreement "
        href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
        external
      />
    ),
  },

  statement1Initial: {
    ...textUI({
      title: 'Initial here',
      description: STATEMENT_1,
    }),
    'ui:webComponentField': CapitalizedTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
      minLength: 'Please enter your initials using letters only',
      pattern: 'Please enter your initials using letters only',
    },
    'ui:validations': [validateInitialsMatch],
  },
  statement2Initial: {
    ...textUI({
      title: 'Initial here',
      description: STATEMENT_2,
    }),
    'ui:webComponentField': CapitalizedTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
      minLength: 'Please enter your initials using letters only',
      pattern: 'Please enter your initials using letters only',
    },
    'ui:validations': [validateInitialsMatch],
  },
  statement3Initial: {
    ...textUI({
      title: 'Initial here',
      description: STATEMENT_3,
    }),
    'ui:webComponentField': CapitalizedTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
      minLength: 'Please enter your initials using letters only',
      pattern: 'Please enter your initials using letters only',
    },
    'ui:validations': [validateInitialsMatch],
  },
  statement4Initial: {
    ...textUI({
      title: 'Initial here',
      description: STATEMENT_4,
    }),
    'ui:webComponentField': CapitalizedTextInputField,
    'ui:options': {
      width: 'small',
      classNames: 'vads-u-margin-bottom--6',
    },
    'ui:errorMessages': {
      required: 'Please enter your initials',
      minLength: 'Please enter your initials using letters only',
      pattern: 'Please enter your initials using letters only',
    },
    'ui:validations': [validateInitialsMatch],
  },
  agreementCheckbox: checkboxUI({
    title: 'Our school agrees to provide Yellow Ribbon Program contributions',
    errorMessages: {
      required: 'You must agree to provide Yellow Ribbon Program contributions',
    },
  }),
};

const schema = {
  type: 'object',
  required: [
    'statement1Initial',
    'statement2Initial',
    'statement3Initial',
    'statement4Initial',
    'agreementCheckbox',
  ],
  properties: {
    'view:additionalInstructions': { type: 'object', properties: {} },
    statement1Initial: {
      type: 'string',
      minLength: 2,
      maxLength: 3,
      pattern: '^[A-Za-z]{2,3}$',
    },
    statement2Initial: {
      type: 'string',
      minLength: 2,
      maxLength: 3,
      pattern: '^[A-Za-z]{2,3}$',
    },
    statement3Initial: {
      type: 'string',
      minLength: 2,
      maxLength: 3,
      pattern: '^[A-Za-z]{2,3}$',
    },
    statement4Initial: {
      type: 'string',
      minLength: 2,
      maxLength: 3,
      pattern: '^[A-Za-z]{2,3}$',
    },
    agreementCheckbox: checkboxRequiredSchema,
  },
};

export { uiSchema, schema };
