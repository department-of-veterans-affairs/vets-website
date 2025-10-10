import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { CancelButton } from '../../config/helpers';
import { calculateAge } from '../../../shared/utils';

const parentReasonToRemove = {
  handlers: {
    goForward: (/* { itemData, index, fullData } */) => 'DONE',
    // itemData.removalReason === 'parentDied' ? 'parent-died' : 'parent-other',
    // return empty path to go to first parent page
    goBack: (/* { itemData, index, fullData } */) => '',

    onSubmit: ({ _event, itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.removalReason) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /**
   * Depedent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} removalReason Dependent's removal reason
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
    fullName,
    formSubmitted,
    firstName,
    handlers,
    returnToMainPage,
  }) => {
    // Not in the design, but added in case the dependent data is invalid
    if (!itemData.dateOfBirth || itemData.relationshipToVeteran !== 'Parent') {
      returnToMainPage();
      return null;
    }

    const onChange = event => {
      const { value } = event.detail;
      // Pass updated itemData to handler.onChange
      handlers.onChange({ ...itemData, removalReason: value });
    };

    const { labeledAge } = calculateAge(itemData.dateOfBirth, {
      dateInFormat: 'yyyy-MM-dd',
    });

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Reason for removing {fullName}
        </h3>
        <VaRadio
          class="vads-u-margin-bottom--2"
          error={
            formSubmitted && !itemData.removalReason ? 'Select an option' : null
          }
          label={`Do any of these apply to ${fullName} (age ${labeledAge})?`}
          onVaValueChange={onChange}
          required
        >
          <VaRadioOption
            name="removalReason"
            label={`${firstName} died`}
            checked={itemData.removalReason === 'parentDied'}
            value="parentDied"
            tile
          />
          <VaRadioOption
            name="removalReason"
            label={`Something else happened to ${firstName}`}
            checked={itemData.removalReason === 'parentOther'}
            value="parentOther"
            tile
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

parentReasonToRemove.propTypes = {
  Component: PropTypes.func,
};

parentReasonToRemove.Component.propTypes = {
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
    removalReason: PropTypes.string,
  }),
  returnToMainPage: PropTypes.func,
};

export default parentReasonToRemove;
