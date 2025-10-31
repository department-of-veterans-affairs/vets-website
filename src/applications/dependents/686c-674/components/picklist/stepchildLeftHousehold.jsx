import React from 'react';
import PropTypes from 'prop-types';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';

const stepchildLeftHousehold = {
  handlers: {
    goForward: () => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.dateStepchildLeftHousehold) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /**
   * Dependent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} isStepchild Whether the child is a stepchild
   * @property {string} removalReason Dependent's removal reason
   * @property {string} stepchildFinancialSupport Whether veteran provides financial support
   * @property {string} dateStepchildLeftHousehold Date stepchild left household
   */
  /**
   * handlers object
   * @typedef {object} Handlers
   * @property {function} onChange Change handler
   * @property {function} onSubmit Submit handler
   */
  /**
   * Followup Component parameters
   * @param {ItemData} itemData Dependent's data
   * @param {string} fullName Dependent's full name
   * @param {boolean} formSubmitted Whether the form has been submitted
   * @param {string} firstName Dependent's first name
   * @param {object} handlers The handlers for the component
   * @param {function} returnToMainPage Function to return to the main remove
   * dependents page
   * @returns React component
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
          When did {firstName} stop living with you?
        </h3>

        <VaMemorableDate
          name="dateStepchildLeftHousehold"
          label="Date stepchild left your household"
          error={
            formSubmitted && !itemData.dateStepchildLeftHousehold
              ? 'Provide a date'
              : null
          }
          monthSelect
          value={itemData.dateStepchildLeftHousehold || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />
      </>
    );
  },
};

stepchildLeftHousehold.propTypes = {
  Component: PropTypes.func,
};

stepchildLeftHousehold.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    dateOfBirth: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
    isStepchild: PropTypes.string,
    removalReason: PropTypes.string,
    stepchildFinancialSupport: PropTypes.string,
    dateStepchildLeftHousehold: PropTypes.string,
  }),
  returnToMainPage: PropTypes.func,
};

export default stepchildLeftHousehold;
