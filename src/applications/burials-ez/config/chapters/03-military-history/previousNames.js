import React from 'react';
import { merge } from 'lodash';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import PropTypes from 'prop-types';
import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import ListItemView from '../../../components/ListItemView';
import { generateHelpText, generateTitle } from '../../../utils/helpers';

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
      <ListItemView title={`${formData?.first} ${formData?.last}`} />
    </>
  );
}

PreviousNamesView.propTypes = {
  formData: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }),
};

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran’s previous name'),
    'ui:options': { pageClass: 'previous-names-view' },
    previousNames: {
      'ui:options': {
        itemName: 'Previous name',
        viewField: PreviousNamesView,
        hideTitle: true,
        uswds: true,
        classNames: 'vads-u-margin--0',
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
        itemAriaLabel: entry => {
          return `${entry.first || ''} ${entry.last || ''}`;
        },
      },
      items: {
        ...fullNameUI(title => `Previous ${title}`),
        serviceBranch: {
          'ui:title': 'Branch of service',
          'ui:description': generateHelpText(
            'Enter any branch of service the deceased Veteran served in while using this name',
          ),
          'ui:webComponentField': VaTextInputField,
          'ui:required': () => true,
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
      previousNames: {
        ...modifiedPreviousNames,
        minItems: 1,
      },
    },
  },
};
