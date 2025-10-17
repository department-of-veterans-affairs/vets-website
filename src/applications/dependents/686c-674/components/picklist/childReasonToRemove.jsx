import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { CancelButton } from '../../config/helpers';
import { calculateAge } from '../../../shared/utils';

/**
 * Get available removal reasons for child based on age and stepchild status
 * @param {boolean} isStepchild Whether the child is a stepchild
 * @param {number} age Child's age in years
 * @param {string} firstName Child's first name for personalization
 * @returns {Array} Array of radio option configurations
 */
const getChildRemovalOptions = (isStepchild, age, firstName) => {
  const options = [];

  // Stepchild-specific options (all ages)
  if (isStepchild) {
    options.push(
      {
        value: 'stepchildDivorce',
        label: `${firstName} left due to divorce`,
      },
      {
        value: 'stepchildLeftHousehold',
        label: `${firstName} left household due to divorce`,
      },
      {
        value: 'stepchildNotMember',
        label: `${firstName} is no longer a member of the household`,
      },
      {
        value: 'stepchildParentDied',
        label: `${firstName}'s parent died`,
      },
    );
  }

  // Child died (all ages, both child and stepchild)
  options.push({
    value: 'childDied',
    label: `${firstName} died`,
  });

  // Child got adopted (all ages, both child and stepchild)
  options.push({
    value: 'childAdopted',
    label: `${firstName} got adopted out of the family`,
  });

  // Child got married (ages 15+)
  if (age >= 15) {
    options.push({
      value: 'childMarried',
      label: `${firstName} got married`,
    });
  }

  // Child no longer in school (ages 18+)
  if (age >= 18) {
    options.push({
      value: 'childNotInSchool',
      label: `${firstName} is no longer in school`,
    });
  }

  return options;
};

const childReasonToRemove = {
  handlers: {
    goForward: (/* { itemData, index, fullData } */) => 'DONE',
    // return empty path to go to first child page
    // goBack: (/* { itemData, index, fullData } */) => '',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.removalReason) {
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
   * @property {string} isStepchild Whether the child is a stepchild ('Y' or 'N')
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
  Component: ({ itemData, fullName, formSubmitted, firstName, handlers }) => {
    const onChange = event => {
      const { value } = event.detail;
      // Pass updated itemData to handler.onChange
      handlers.onChange({ ...itemData, removalReason: value });
    };

    const { age } = calculateAge(itemData.dateOfBirth, {
      dateInFormat: 'yyyy-MM-dd',
    });

    const isStepchild = itemData.isStepchild === 'Y';
    const removalOptions = getChildRemovalOptions(isStepchild, age, firstName);

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
          label={`Do any of these apply to ${fullName} (age ${age})?`}
          hint="Select the event that happened first"
          onVaValueChange={onChange}
          required
        >
          {removalOptions.map(option => (
            <VaRadioOption
              key={option.value}
              name="removalReason"
              label={option.label}
              checked={itemData.removalReason === option.value}
              value={option.value}
              tile
            />
          ))}
        </VaRadio>

        <CancelButton
          dependentType={itemData.relationshipToVeteran?.toLowerCase()}
          removePath="options-selection/remove-active-dependents"
        />
      </>
    );
  },
};

childReasonToRemove.propTypes = {
  Component: PropTypes.func,
};

childReasonToRemove.Component.propTypes = {
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
  }),
  returnToMainPage: PropTypes.func,
};

export default childReasonToRemove;
