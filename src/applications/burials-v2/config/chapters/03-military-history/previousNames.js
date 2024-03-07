import React from 'react';
import { merge } from 'lodash';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import PropTypes from 'prop-types';
import { fullNameUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import ListItemView from '../../../components/ListItemView';
import { generateTitle } from '../../../utils/helpers';

const { previousNames } = fullSchemaBurials.properties;

const modifiedPreviousNames = merge(previousNames, {
  items: {
    properties: {
      serviceBranch: {
        type: 'string',
      },
    },
  },
});

export function PreviousNamesView({ formData }) {
  return (
    <>
      <ListItemView title={formData?.first} />
    </>
  );
}

PreviousNamesView.propTypes = {
  formData: PropTypes.shape({
    first: PropTypes.string,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran’s previous name'),
    previousNames: {
      'ui:options': {
        itemName: 'Service period',
        viewField: PreviousNamesView,
        hideTitle: true,
        uswds: true,
        classNames: 'vads-u-margin--0',
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      items: {
        ...fullNameUI(title => `Veteran’s ${title}`),
        serviceBranch: {
          'ui:title': 'Branch of service',
          'ui:webComponentField': VaTextInputField,
          'ui:required': () => true,
          'ui:options': {
            widgetClassNames: 'form-select-medium',
            uswds: true,
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      previousNames: {
        ...modifiedPreviousNames,
        minItems: 1,
      },
    },
  },
};
