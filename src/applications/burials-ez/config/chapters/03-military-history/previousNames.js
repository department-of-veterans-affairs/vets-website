import React from 'react';
import { merge } from 'lodash';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import PropTypes from 'prop-types';
import {
  fullNameUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';

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
    ...titleUI('Veteran’s previous name'),
    'ui:options': { pageClass: 'previous-names-view' },
    previousNames: {
      'ui:options': {
        itemName: 'Previous name',
        viewField: PreviousNamesView,
        hideTitle: true,
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
        serviceBranch: textUI({
          title: 'Branch of service',
          hint:
            'Enter any branch of service the deceased Veteran served in while using this name',
          required: () => true,
        }),
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
