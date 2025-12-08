import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { CancelButton } from '../../config/helpers';
import { scrollToError } from './helpers';
import { labels } from './utils';
import propTypes from './types';

const parentReasonToRemove = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: ({ itemData }) => {
      return itemData.removalReason === 'parentDied'
        ? 'parent-death'
        : 'parent-exit';
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
    handlers,
    returnToMainPage,
    isEditing,
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

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {labels.Parent.removalReasonTitle(fullName, isEditing)}
        </h3>
        <VaRadio
          class="vads-u-margin-bottom--2"
          error={
            formSubmitted && !itemData.removalReason
              ? labels.Parent.removalReasonError
              : null
          }
          label={labels.Parent.removalReason}
          hint={labels.Parent.removalReasonHint}
          onVaValueChange={onChange}
          enable-analytics
          required
        >
          <VaRadioOption
            name="removalReason"
            label={labels.Parent.parentDied}
            checked={itemData.removalReason === 'parentDied'}
            value="parentDied"
          />
          <VaRadioOption
            name="removalReason"
            label={labels.Parent.parentOther}
            checked={itemData.removalReason === 'parentOther'}
            value="parentOther"
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

parentReasonToRemove.propTypes = propTypes.Page;
parentReasonToRemove.Component.propTypes = propTypes.Component;

export default parentReasonToRemove;
