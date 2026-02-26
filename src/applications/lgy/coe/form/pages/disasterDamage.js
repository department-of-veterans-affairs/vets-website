import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { PropertyAddress } from '../components/PropertyAddress';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Property with VA home loan: Disaster damage',
      ({ formData }) => (
        <div>
          <p>Provide VA home loan information for this property.</p>
          <PropertyAddress formData={formData} />
        </div>
      ),
    ),
    naturalDisaster: {
      affected: yesNoUI({
        title:
          'Has this property been substantially damaged or destroyed due to a federally declared national disaster?',
      }),
      dateOfLoss: currentOrPastMonthYearDateUI({
        title: 'When did the damage happen?',
        required: (formData, index) =>
          formData.relevantPriorLoans?.[index]?.naturalDisaster?.affected,
        expandUnder: 'affected',
        expandUnderCondition: true,
      }),
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        const isDateOfLossCollapsed =
          formSchema?.properties?.naturalDisaster?.properties?.dateOfLoss?.[
            'ui:collapsed'
          ];
        return {
          ...formSchema,
          properties: {
            ...formSchema.properties,
            naturalDisaster: {
              ...formSchema.properties.naturalDisaster,
              required: isDateOfLossCollapsed
                ? ['affected']
                : ['affected', 'dateOfLoss'],
            },
          },
        };
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      naturalDisaster: {
        type: 'object',
        properties: {
          affected: yesNoSchema,
          dateOfLoss: currentOrPastMonthYearDateSchema,
        },
        required: ['affected'],
      },
    },
  },
};
