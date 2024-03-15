import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ArrayBuilderCards from '../arrayBuilder/components/ArrayBuilderCards';

export const SummaryCards = (
  <ArrayBuilderCards
    cardDescription={itemData =>
      `${itemData?.dateStart} - ${itemData?.dateEnd}`
    }
    arrayPath="employers"
    nounSingular="employer"
    nounPlural="employers"
    isIncomplete={item =>
      !item?.name ||
      !item?.address?.country ||
      !item?.address?.city ||
      !item?.address?.street ||
      !item?.address?.postalCode
    }
    editItemBasePathUrl="/array-multiple-page-builder-item-page-1"
  />
);

/** @type {PageSchema} */
export const arrayMultiPageBuilderSummary = {
  uiSchema: {
    'ui:description': SummaryCards,
    hasEmployment: yesNoUI({
      updateUiSchema: formData => {
        return formData?.employers?.length
          ? {
              'ui:title': `Do you have another employer to report?`,
              'ui:options': {
                labelHeaderLevel: '4',
                hint: '',
                labels: {
                  Y: 'Yes, I have another employer to report',
                  N: 'No, I don’t have another employer to report',
                },
              },
            }
          : {
              'ui:title': `Do you have any employment, including self-employment for the last 5 years to report?`,
              'ui:options': {
                labelHeaderLevel: '3',
                hint:
                  'Include self-employment and military duty (including inactive duty for training).',
                labels: {
                  Y: 'Yes, I have employment to report',
                  N: 'No, I don’t have employment to report',
                },
              },
            };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      hasEmployment: yesNoSchema,
    },
    required: ['hasEmployment'],
  },
};
