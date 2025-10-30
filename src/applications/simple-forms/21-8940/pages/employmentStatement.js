import {
  textUI,
  addressUI,
  numberUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  addressSchema,
  numberSchema,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { EmployerView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    militaryDutyPrevented: yesNoUI({
      title:
        'If you are currently serving in the reserve or national guard, does your service connected disability prevent you from performing your military duties?',

      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    totalIncome: numberUI(
      'Indicate your total earned income for the past 12 months',
    ),

    monthlyIncome: numberUI(
      'If presently employed, indicate your current monthly earned income',
    ),

    leavedEmployment: yesNoUI({
      title:
        'Did you leave your last job/self-employment because of your disability?',

      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    disabilityBenefits: yesNoUI({
      title: 'Do you receive/expect to receive disability retirement benefits?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    compensationBenefits: yesNoUI({
      title: 'Do you receive/expect to receive workers compensation benefits?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    triedEmployment: yesNoUI({
      title:
        'Have you attempted to obtain employment since becoming unemployable due to your service-connected disability?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    employers: {
      'ui:options': {
        itemName: 'Employer',
        viewField: EmployerView,
        customTitle: 'Employment attempts',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this employer?',
        addAnotherText: 'Add another employer',
        hideIf: formData => formData.triedEmployment !== true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        employerName: textUI("Employer's name"),
        employerAddress: addressUI({
          labels: {
            street: 'Street address',
            city: 'City',
            state: 'State',
            postalCode: 'Postal code',
          },
          omit: ['street2', 'street3'],
        }),
        typeOfWork: textUI('Type of work'),
        dateApplied: currentOrPastDateUI('Date applied'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryDutyPrevented: yesNoSchema,
      totalIncome: numberSchema,
      monthlyIncome: numberSchema,
      leavedEmployment: yesNoSchema,
      disabilityBenefits: yesNoSchema,
      compensationBenefits: yesNoSchema,
      triedEmployment: yesNoSchema,
      employers: {
        type: 'array',
        minItems: 0,
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            employerName: {
              type: 'string',
              maxLength: 100,
            },
            employerAddress: addressSchema({
              omit: ['street2', 'street3', 'isMilitary'],
            }),
            typeOfWork: {
              type: 'string',
              maxLength: 100,
            },
            dateApplied: {
              type: 'string',
              maxLength: 50,
            },
          },
          required: [
            'employerName',
            'employerAddress',
            'typeOfWork',
            'dateApplied',
          ],
        },
      },
    },
    required: [
      'militaryDutyPrevented',
      'totalIncome',
      'monthlyIncome',
      'leavedEmployment',
      'disabilityBenefits',
      'compensationBenefits',
      'triedEmployment',
    ],
  },
};
