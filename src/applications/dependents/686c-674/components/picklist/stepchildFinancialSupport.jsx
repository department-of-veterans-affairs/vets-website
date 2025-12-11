import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToError } from './helpers';
import propTypes from './types';

import { makeNamePossessive } from '../../../shared/utils';

const stepchildFinancialSupport = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
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

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.stepchildFinancialSupport) {
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
      const { value } = event.detail;
      // Pass updated itemData to handler.onChange
      handlers.onChange({ ...itemData, stepchildFinancialSupport: value });
    };

    return (
      <VaRadio
        class="vads-u-margin-bottom--2 dd-privacy-mask"
        data-dd-action-name="Do you provide at least half of this stepchild's financial support?"
        error={
          formSubmitted && !itemData.stepchildFinancialSupport
            ? 'Select an option'
            : null
        }
        label={`Do you provide at least half of ${makeNamePossessive(
          firstName,
        )} financial support?`}
        labelHeaderLevel="3"
        onVaValueChange={onChange}
        enable-analytics
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
    );
  },
};

stepchildFinancialSupport.propTypes = propTypes.Page;
stepchildFinancialSupport.Component.propTypes = propTypes.Component;

export default stepchildFinancialSupport;
