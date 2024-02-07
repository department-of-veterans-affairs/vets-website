import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { currentOrPastDateUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { validateDateRange } from '@department-of-veterans-affairs/platform-forms-system/validation';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatReviewDate } from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { generateTitle, generateHelpText } from '../../../utils/helpers';
import ListItemView from '../../../components/ListItemView';

const { toursOfDuty } = fullSchemaBurials.properties;

export function dateRangeUI(
  from = 'From',
  to = 'To',
  rangeError = 'To date must be after From date',
) {
  return {
    'ui:validations': [validateDateRange],
    'ui:errorMessages': {
      pattern: rangeError,
      required: 'Please enter a date',
    },
    from: currentOrPastDateUI(from),
    to: currentOrPastDateUI(to),
  };
}

export function ServicePeriodView({ formData }) {
  const from = formData?.dateRange?.from
    ? formatReviewDate(formData?.dateRange?.from)
    : '';
  const to = formData?.dateRange?.to
    ? formatReviewDate(formData?.dateRange?.to)
    : '';

  return (
    <>
      <ListItemView title={formData?.serviceBranch} />
      <p>{formData?.dateRange ? `${from} - ${to}` : ''}</p>
    </>
  );
}

ServicePeriodView.propTypes = {
  formData: PropTypes.shape({
    dateRange: PropTypes.string,
    serviceBranch: PropTypes.string,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Service periods'),
    militaryServiceNumber: {
      'ui:title': 'Military Service number',
      'ui:description': generateHelpText(
        'Enter this only if the deceased Veteran has one',
      ),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
        uswds: true,
      },
    },
    toursOfDuty: {
      'ui:options': {
        itemName: 'Service Period',
        viewField: ServicePeriodView,
        hideTitle: true,
        uswds: true,
        classNames: 'vads-u-margin--0',
        reviewTitle: 'Service periods',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      items: {
        dateRange: {
          ...dateRangeUI(
            'Service start date',
            'Service end date',
            'End of service must be after start of service',
          ),
          'ui:options': {
            uswds: true,
          },
        },
        serviceBranch: {
          'ui:title': 'Branch of service',
          'ui:webComponentField': VaTextInput,
          'ui:options': {
            uswds: true,
          },
        },
        rank: {
          'ui:title': 'Grade, rank or rating',
          'ui:webComponentField': VaTextInput,
          'ui:options': {
            uswds: true,
          },
        },
        placeOfEntry: {
          'ui:title': 'Place of entry',
          'ui:webComponentField': VaTextInput,
          'ui:options': {
            uswds: true,
          },
        },
        placeOfSeparation: {
          'ui:title': 'Place of separation',
          'ui:webComponentField': VaTextInput,
          'ui:options': {
            uswds: true,
          },
        },
        unit: {
          'ui:title': 'Unit',
          'ui:webComponentField': VaTextInput,
          'ui:options': {
            uswds: true,
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceNumber: {
        type: 'string',
      },
      toursOfDuty,
    },
  },
};
