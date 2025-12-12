import React from 'react';
import {
  VaCheckbox,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  SelectCountry,
  SelectState,
  getValue,
  PastDate,
  scrollToError,
} from './helpers';
import { getPastDateError } from './utils';
import propTypes from './types';

import { makeNamePossessive } from '../../../shared/utils';

const parentDeath = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      const hasError = getPastDateError(itemData.endDate);
      if (
        hasError ||
        !itemData.endCity ||
        (!itemData.endOutsideUs && !itemData.endState) ||
        (itemData.endOutsideUs && !itemData.endCountry)
      ) {
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
  Component: ({ itemData, firstName, handlers, formSubmitted, isEditing }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {isEditing ? 'Edit information' : 'Information'} about{' '}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {makeNamePossessive(firstName)}
          </span>{' '}
          death
        </h3>

        <h4>When did they die?</h4>
        <PastDate
          label="Date of death"
          date={itemData.endDate}
          formSubmitted={formSubmitted}
          missingErrorMessage="Enter a date of death"
          onChange={onChange}
        />

        <h4>Where did they die?</h4>
        <VaCheckbox
          name="endOutsideUs"
          label="Death occurred outside the United States"
          checked={itemData.endOutsideUs || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="endCity"
          label={`City${itemData.endOutsideUs ? '' : ' or county'}`}
          error={
            formSubmitted && !itemData.endCity
              ? `Enter a city${itemData.endOutsideUs ? '' : ' or county'}`
              : null
          }
          value={itemData.endCity || ''}
          onVaInput={onChange}
          required
        />
        {itemData.endOutsideUs ? (
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

parentDeath.propTypes = propTypes.Page;
parentDeath.Component.propTypes = propTypes.Component;

export default parentDeath;
