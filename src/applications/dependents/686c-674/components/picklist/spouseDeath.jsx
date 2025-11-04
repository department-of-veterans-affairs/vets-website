import React from 'react';
import {
  VaCheckbox,
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { SelectCountry, SelectState, getValue } from './helpers';
import propTypes from './types';

const spouseDeath = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.endDate ||
        !itemData.endCity ||
        (!itemData.endOutsideUS && !itemData.endState) ||
        (itemData.endOutsideUS && !itemData.endCountry)
      ) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /** @type {PicklistComponentProps} */
  Component: ({ itemData, firstName, handlers, formSubmitted, isEditing }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {isEditing ? 'Edit information' : 'Information'} about the death of{' '}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {firstName}
          </span>
        </h3>
        <h4>When was the death?</h4>
        <VaMemorableDate
          name="endDate"
          label="Date of death"
          error={
            formSubmitted && !itemData.endDate
              ? 'Provide a date of death'
              : null
          }
          monthSelect
          value={itemData.endDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where did the death happen?</h4>
        <VaCheckbox
          name="endOutsideUS"
          label="The death happened outside the United States"
          checked={itemData.endOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="endCity"
          label={`City${itemData.endOutsideUS ? '' : ' or county'}`}
          error={
            formSubmitted && !itemData.endCity
              ? `Enter a city${itemData.endOutsideUS ? '' : ' or county'}`
              : null
          }
          value={itemData.endCity || ''}
          onVaInput={onChange}
          required
        />
        {itemData.endOutsideUS ? (
          <>
            <VaTextInput
              class="vads-u-margin-top--4"
              name="endProvince"
              label="Province, region or territory"
              onVaInput={onChange}
              value={itemData.endProvince || ''}
            />
            <SelectCountry
              name="endCountry"
              label="Country"
              error={
                formSubmitted && !itemData.endCountry
                  ? 'Select a country'
                  : null
              }
              onChange={onChange}
              value={itemData.endCountry || ''}
            />
          </>
        ) : (
          <SelectState
            label="State"
            name="endState"
            error={
              formSubmitted && !itemData.endState ? 'Select a state' : null
            }
            onChange={onChange}
            value={itemData.endState || ''}
          />
        )}
      </>
    );
  },
};

spouseDeath.propTypes = propTypes.Page;
spouseDeath.Component.propTypes = propTypes.Component;

export default spouseDeath;
