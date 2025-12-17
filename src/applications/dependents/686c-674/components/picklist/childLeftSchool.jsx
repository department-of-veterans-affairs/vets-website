import React from 'react';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue, PastDate } from './helpers';
import { getPastDateError } from './utils';
import propTypes from './types';

const childLeftSchool = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      const hasError = getPastDateError(itemData.endDate);
      if (hasError) {
        setTimeout(() => scrollToFirstError({ focusOnAlertRole: true }));
      } else {
        goForward();
      }
    },
  },

  /**
   * @type {PicklistComponentProps}
   * @returns {React.ReactElement} Page component
   */
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
          stop attending school?
        </h3>

        <PastDate
          label="Date child stopped attending school"
          date={itemData.endDate}
          formSubmitted={formSubmitted}
          missingErrorMessage="Enter last date of school attendance"
          onChange={onChange}
        />
      </>
    );
  },
};

childLeftSchool.propTypes = propTypes.Page;
childLeftSchool.Component.propTypes = propTypes.Component;

export default childLeftSchool;
