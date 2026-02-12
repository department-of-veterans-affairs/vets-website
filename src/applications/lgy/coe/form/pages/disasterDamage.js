import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { PropertyAddress } from '../components/PropertyAddress';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Property with VA home loan: Disaster damage',
      // eslint-disable-next-line no-unused-vars
      ({ formData }) => (
        <div>
          <p>Provide VA home loan information for this property.</p>
          {/* <PropertyAddress formData={formData} /> */}
        </div>
      ),
    ),
    affected: yesNoUI({
      title:
        'Has this property been substantially damaged or destroyed due to a federally declared national disaster?',
    }),
    dateOfLoss: currentOrPastMonthYearDateUI({
      title: 'When did the damage happen?',
      //   required: formData => // TODO: update when array builder is created
      expandUnder: 'affected',
      expandUnderCondition: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      affected: yesNoSchema,
      dateOfLoss: currentOrPastMonthYearDateSchema,
    },
    required: ['affected'],
  },
};
