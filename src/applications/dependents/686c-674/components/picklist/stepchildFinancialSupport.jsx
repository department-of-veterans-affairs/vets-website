import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { CancelButton } from '../../config/helpers';

const stepchildFinancialSupport = {
  handlers: {
    goForward: ({ itemData /* , index, fullData */ }) => {
      // If providing financial support, stepchild remains eligible
      if (itemData.stepchildFinancialSupport === 'Y') {
        return 'stepchild-financial-support-exit';
      }
      // If not providing financial support, ask when they left household
      if (itemData.stepchildFinancialSupport === 'N') {
        return 'stepchild-left-household';
      }
      return 'DONE';
    },

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.stepchildFinancialSupport) {
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
      const { value } = event.detail;
      // Pass updated itemData to handler.onChange
      handlers.onChange({ ...itemData, stepchildFinancialSupport: value });
    };

    return (
      <>
        <VaRadio
          class=""
          error={
            formSubmitted && !itemData.stepchildFinancialSupport
              ? 'Select an option'
              : null
          }
          label={`Do you provide at least half of ${firstName}'s financial support?`}
          labelHeaderLevel="3"
          onVaValueChange={onChange}
          required
        >
          <VaRadioOption
            name="stepchildFinancialSupport"
            label="Yes"
            checked={itemData.stepchildFinancialSupport === 'Y'}
            value="Y"
          />
          <VaRadioOption
            name="stepchildFinancialSupport"
            label="No"
            checked={itemData.stepchildFinancialSupport === 'N'}
            value="N"
          />
        </VaRadio>

        <CancelButton
          dependentType={itemData.relationshipToVeteran?.toLowerCase()}
          removePath="options-selection/remove-active-dependents"
        />
      </>
    );
  },
};

stepchildFinancialSupport.propTypes = {
  Component: PropTypes.func,
};

stepchildFinancialSupport.Component.propTypes = {
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
  }),
  returnToMainPage: PropTypes.func,
};

export default stepchildFinancialSupport;
