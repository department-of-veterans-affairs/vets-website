import VeteranInformation from '../../../components/VeteranInformationComponent';
import VeteranInformationReviewPage from '../../../components/VeteranInformationReviewPage';

/** @returns {PageSchema} */
export const veteranInformation = {
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        properties: {
          ssnLastFour: {
            // Including this is required to get the review page content to
            // render, but this also adds a field to the Veteran info page, so
            // I tried to hide it using 'ui:hidden': true, but it didn't work
            // as expected, so I hid the field using CSS.
            type: 'string',
          },
        },
      },
    },
  },
  uiSchema: {
    'ui:description': VeteranInformation,
    veteranInformation: {},
    'ui:objectViewField': VeteranInformationReviewPage,
  },
};
