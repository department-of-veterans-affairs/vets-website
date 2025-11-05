import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';
import propTypes from './types';

const childHasDisability = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: ({ itemData /* , index, fullData */ }) =>
      itemData.childHasPermanentDisability === 'Y'
        ? 'child-exit'
        : 'child-left-school',

    /** @type {OnSubmitParams} */
    onSubmit: ({ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.childHasPermanentDisability) {
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

    return (
      <>
        <VaRadio
          class="vads-u-margin-bottom--2 dd-privacy-mask"
          data-dd-action-name="Does child have permanent disability?"
          name="childHasPermanentDisability"
          error={
            formSubmitted && !itemData.childHasPermanentDisability
              ? 'Select an option'
              : null
          }
          label={`${
            isEditing ? 'Edit does' : 'Does'
          } ${fullName} have a permanent disability?`}
          labelHeaderLevel="3"
          onVaValueChange={onChange}
          required
        >
          <VaRadioOption
            name="childHasPermanentDisability"
            label="Yes"
            checked={itemData.childHasPermanentDisability === 'Y'}
            value="Y"
          />
          <VaRadioOption
            name="childHasPermanentDisability"
            label="No"
            checked={itemData.childHasPermanentDisability === 'N'}
            value="N"
          />
        </VaRadio>

        <va-additional-info trigger="What we mean by a permanent disability">
          <p>
            A child has a permanent disability if they developed physical or
            mental condition before they turned 18 that will last their whole
            life.
          </p>
          <p>
            A child with a permanent disability can’t support or care for
            themselves.
          </p>
        </va-additional-info>
      </>
    );
  },
};

childHasDisability.propTypes = propTypes.Page;
childHasDisability.Component.propTypes = propTypes.Component;

export default childHasDisability;
