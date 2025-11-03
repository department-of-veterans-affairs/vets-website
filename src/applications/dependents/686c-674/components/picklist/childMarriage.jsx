import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';
import propTypes from './types';

const childMarried = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { _itemData, _index, _fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.endDate) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /** @type {PicklistComponentProps} */
  Component: ({ itemData, firstName, handlers, formSubmitted, isEditing }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {isEditing ? 'Edit when' : 'When'} did{' '}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {firstName}
          </span>{' '}
          get married?
        </h3>

        <VaMemorableDate
          name="marriageDate"
          label="Date of marriage"
          error={formSubmitted && !itemData.endDate ? 'Enter a date' : null}
          monthSelect
          value={itemData.endDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />
      </>
    );
  },
};

childMarried.propTypes = propTypes.Page;
childMarried.Component.propTypes = propTypes.Component;

export default childMarried;
