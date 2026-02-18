import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToError } from './helpers';
import { labels } from './utils';
import propTypes from './types';

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
      label: labels.Child.childNotInSchool,
    });
  }

  if (isStepchild) {
    options.push({
      value: 'stepchildNotMember',
      label: labels.Child.stepchildNotMember,
    });
  }

  // Child got adopted (all ages, both child and stepchild)
  options.push({
    value: 'childAdopted',
    label: labels.Child.childAdopted,
  });

  // Child got married (ages 15+)
  if (age >= 15) {
    options.push({
      value: 'childMarried',
      label: labels.Child.childMarried,
    });
  }

  // Child died (all ages, both child and stepchild)
  options.push({
    value: 'childDied',
    label: labels.Child.childDied,
  });

  return options;
};

const childReasonToRemove = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: ({ itemData /* , index, fullData */ }) => {
      switch (itemData.removalReason) {
        case 'childMarried':
          return 'child-marriage';
        case 'childDied':
          return 'child-death';
        case 'stepchildNotMember':
          return 'stepchild-financial-support';
        case 'childNotInSchool':
          return 'child-left-school';
        case 'childAdopted':
          return 'child-adopted-exit';
        default:
          return 'DONE';
      }
    },

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.removalReason) {
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
    fullName,
    formSubmitted,
    firstName,
    handlers,
    isEditing,
  }) => {
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
          {labels.Child.removalReasonTitle(fullName, isEditing)}
        </h3>
        <VaRadio
          class="vads-u-margin-bottom--2"
          error={
            formSubmitted && !itemData.removalReason
              ? labels.Child.removalReasonError
              : null
          }
          label={labels.Child.removalReason}
          hint={labels.Child.removalReasonHint}
          onVaValueChange={onChange}
          enable-analytics
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
      </>
    );
  },
};

childReasonToRemove.propTypes = propTypes.Page;
childReasonToRemove.Component.propTypes = propTypes.Component;

export default childReasonToRemove;
