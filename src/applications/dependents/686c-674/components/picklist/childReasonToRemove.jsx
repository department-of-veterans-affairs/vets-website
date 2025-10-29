import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { calculateAge } from '../../../shared/utils';

/**
 * Get available removal reasons for child based on age and stepchild status
 * @param {boolean} isStepchild Whether the child is a stepchild
 * @param {number} age Child's age in years
 * @param {string} _firstName Child's first name for personalization
 * @returns {Array} Array of radio option configurations
 */
const getChildRemovalOptions = (isStepchild, age, _firstName) => {
  const options = [];

  // Child no longer in school (ages 18+)
  if (age >= 18) {
    options.push({
      value: 'childNotInSchool',
      label: 'They’re no longer enrolled in school',
    });
  }

  if (isStepchild) {
    options.push({
      value: 'stepchildNotMember',
      label: 'They no longer live with you',
    });
  }

  // Child got adopted (all ages, both child and stepchild)
  options.push({
    value: 'childAdopted',
    label: 'They were adopted by another family',
  });

  // Child got married (ages 15+)
  if (age >= 15) {
    options.push({
      value: 'childMarried',
      label: 'They got married',
    });
  }

  // Child died (all ages, both child and stepchild)
  options.push({
    value: 'childDied',
    label: 'They died',
  });

  return options;
};

const childReasonToRemove = {
  handlers: {
    goForward: ({ itemData /* , index, fullData */ }) => {
      switch (itemData.removalReason) {
        case 'childMarried':
          return 'child-marriage';
        case 'childDied':
          return 'child-death';
        case 'stepchildNotMember':
          return 'stepchild-financial-support';
        case 'childNotInSchool':
        case 'childAdopted':
          return 'DONE';
        default:
          return 'DONE';
      }
    },

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
          label="Why do you need to remove this dependent?"
          hint="If more than one applies, select what happened first."
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
              // tile
            />
          ))}
        </VaRadio>

        {isStepchild && (
          <va-additional-info
            className="vads-u-margin-bottom--4"
            trigger="Stepchildren living apart temporarily"
          >
            <span>
              A stepchild can stay on your benefits in these situations:{' '}
            </span>
            <ul>
              <li>They’re away at school or college</li>
              <li>They live with their other parent part of the time</li>
              <li>
                They’re temporarily away for military deployment, medical care,
                or incarceration
              </li>
              <li>They’re away in any other short-term situation</li>
            </ul>
          </va-additional-info>
        )}
        {/* <CancelButton */}
        {/*  dependentType={itemData.relationshipToVeteran?.toLowerCase()} */}
        {/*  removePath="options-selection/remove-active-dependents" */}
        {/* /> */}
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
