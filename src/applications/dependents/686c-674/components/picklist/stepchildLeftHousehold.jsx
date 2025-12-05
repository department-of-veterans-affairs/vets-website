import React from 'react';

import { getValue, PastDate, scrollToError } from './helpers';
import { getPastDateError } from './utils';
import propTypes from './types';

const stepchildLeftHousehold = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: () => 'DONE',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      const hasError = getPastDateError(itemData.endDate);
      if (hasError) {
        scrollToError();
      } else {
        goForward();
      }
    },
  },

  /**
   * @type {PicklistComponentProps}
   * @returns {React.ReactElement} Page component
   */
  Component: ({
    itemData,
    formSubmitted,
    firstName,
    handlers,
    returnToMainPage,
  }) => {
    if (
      !itemData.dateOfBirth ||
      itemData.relationshipToVeteran !== 'Child' ||
      itemData.isStepchild !== 'Y' ||
      itemData.removalReason !== 'stepchildNotMember'
    ) {
      returnToMainPage();
      return null;
    }

    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          When did{' '}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {firstName}
          </span>{' '}
          stop living with you?
        </h3>

        <PastDate
          label="Date stepchild left your household"
          date={itemData.endDate}
          formSubmitted={formSubmitted}
          missingErrorMessage="Provide a date"
          onChange={onChange}
        />
      </>
    );
  },
};

stepchildLeftHousehold.propTypes = propTypes.Page;
stepchildLeftHousehold.Component.propTypes = propTypes.Component;

export default stepchildLeftHousehold;
