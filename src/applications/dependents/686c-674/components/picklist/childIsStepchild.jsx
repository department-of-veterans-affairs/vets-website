import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';
import { labels } from './utils';
import { CancelButton } from '../../config/helpers';
import { calculateAge } from '../../../shared/utils';
import propTypes from './types';

const childIsStepchild = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) =>
      'child-reason-to-remove',
    // return empty path to go to first child page
    // goBack: (/* { itemData, index, fullData } */) => '',

    /** @type {OnSubmitParams} */
    onSubmit: ({ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.isStepchild) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /** @type {PicklistComponentProps} */
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
          class="vads-u-margin-bottom--2"
          name="isStepchild"
          error={
            formSubmitted && !itemData.isStepchild
              ? labels.Child.isStepChildError
              : null
          }
          label={labels.Child.isStepChildTitle(fullName, cleanAge, isEditing)}
          labelHeaderLevel="3"
          onVaValueChange={onChange}
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
