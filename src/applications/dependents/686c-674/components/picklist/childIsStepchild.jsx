import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getValue, scrollToError } from './helpers';
import { labels } from './utils';
import { CancelButton } from '../../config/helpers';
import { calculateAge } from '../../../shared/utils';
import propTypes from './types';

const childIsStepchild = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: (/* { itemData, index, fullData } */) =>
      'child-reason-to-remove',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.isStepchild) {
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
  Component: ({ itemData, fullName, handlers, formSubmitted, isEditing }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };
    const { labeledAge } = calculateAge(itemData.dateOfBirth, {
      dateInFormat: 'yyyy-MM-dd',
    });

    // remove ' years' and ' old':
    // 'age 11 years old' -> 'age 11' & 'age 5 months old' -> 'age 5 months'
    const cleanAge = labeledAge.replace(' years', '').replace(' old', '');

    return (
      <>
        <VaRadio
          class="vads-u-margin-bottom--2 dd-privacy-mask"
          data-dd-action-name="is stepchild question"
          name="isStepchild"
          error={
            formSubmitted && !itemData.isStepchild
              ? labels.Child.isStepChildError
              : null
          }
          label={labels.Child.isStepChildTitle(fullName, cleanAge, isEditing)}
          labelHeaderLevel="3"
          onVaValueChange={onChange}
          enable-analytics
          required
        >
          <VaRadioOption
            name="isStepchild"
            label={labels.Child.isStepChildYes}
            checked={itemData.isStepchild === 'Y'}
            value="Y"
          />
          <VaRadioOption
            name="isStepchild"
            label={labels.Child.isStepChildNo}
            checked={itemData.isStepchild === 'N'}
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

childIsStepchild.propTypes = propTypes.Page;
childIsStepchild.Component.propTypes = propTypes.Component;

export default childIsStepchild;
