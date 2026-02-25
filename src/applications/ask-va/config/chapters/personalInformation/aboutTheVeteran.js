import React from 'react';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  selectSchema,
  selectUI,
  serviceNumberSchema,
  serviceNumberUI,
  ssnSchema,
  ssnUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  branchesOfService,
  CHAPTER_3,
  suffixes,
  yesNoOptions,
} from '../../../constants';
import { isBranchOfServiceRequired } from '../../helpers';

const ssnServiceInfo = (
  <div className="vads-u-margin-bottom--neg2p5">
    <p className="vads-u-margin-bottom--1">
      <span className="vads-u-font-weight--bold">
        Social Security or service number
      </span>
      <span className="form-required-span">(*Required)</span>
    </p>
    <p className="vads-u-font-size--sm vads-u-margin-bottom-1">
      Provide one of the following:
    </p>
  </div>
);

const aboutTheVeteranPage = {
  uiSchema: {
    ...titleUI(CHAPTER_3.ABOUT_THE_VET.TITLE),
    aboutTheVeteran: {
      first: {
        'ui:title': 'First name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'given-name',
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Provide the Veteran's first name",
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'additional-name',
      },
      last: {
        'ui:title': 'Last name',
        'ui:webComponentField': VaTextInputField,
        'ui:autocomplete': 'family-name',
        'ui:required': () => true,
        'ui:errorMessages': {
          required: "Provide the Veteran's last name",
        },
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:webComponentField': VaSelectField,
        'ui:autocomplete': 'honorific-suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
        },
      },
      isVeteranDeceased: yesNoUI({
        title: CHAPTER_3.VET_DECEASED.TITLE,
        labels: yesNoOptions,
        errorMessages: {
          required: 'Let us know if the Veteran is deceased',
        },
      }),
      socialOrServiceNum: {
        'ui:title': ssnServiceInfo,
        'ui:options': { showFieldLabel: true },
        ssn: ssnUI(),
        serviceNumber: serviceNumberUI('Service number'),
        'ui:validations': [
          (errors, field) => {
            if (!Object.keys(field).some(key => field[key])) {
              errors.addError(
                "Enter either the Veteran's Social Security number or Service number",
              );
            }
          },
        ],
      },
      branchOfService: selectUI({
        title: CHAPTER_3.VETERANS_BRANCH_OF_SERVICE.TITLE,
        errorMessages: {
          required: CHAPTER_3.VETERANS_BRANCH_OF_SERVICE.ERROR,
        },
        required: formData => {
          return isBranchOfServiceRequired(formData);
        },
        hideIf: formData => {
          return !isBranchOfServiceRequired(formData);
        },
        hideEmptyValueInReview: true,
      }),
      dateOfBirth: dateOfBirthUI({
        errorMessages: {
          required: "Provide the Veteran's date of birth",
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      aboutTheVeteran: {
        type: 'object',
        required: ['first', 'last', 'isVeteranDeceased', 'dateOfBirth'],
        properties: {
          first: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          middle: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          last: {
            type: 'string',
            pattern: '^[^0-9]*$',
            minLength: 1,
            maxLength: 30,
          },
          suffix: selectSchema(suffixes),
          isVeteranDeceased: yesNoSchema,
          socialOrServiceNum: {
            type: 'object',
            properties: {
              ssn: ssnSchema,
              serviceNumber: serviceNumberSchema,
            },
            required: [],
          },
          branchOfService: {
            type: 'string',
            enum: branchesOfService,
          },
          dateOfBirth: dateOfBirthSchema,
        },
      },
    },
  },
};

export default aboutTheVeteranPage;
