import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { SelectCountry, SelectState, getValue } from './helpers';

const parentDeath = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.parentDeathDate ||
        !itemData.parentDeathCity ||
        (!itemData.parentDeathOutsideUS && !itemData.parentDeathState) ||
        (itemData.parentDeathOutsideUS && !itemData.parentDeathCountry)
      ) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /**
   * Depedent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} parentDeathType Dependent's removal reason
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
   * @param {function} goBack Function to go back to the previous page
   * @returns React component
   */
  Component: ({ itemData, firstName, handlers, formSubmitted }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Information about the death of {firstName}
        </h3>
        <h4>When was the death?</h4>
        <VaMemorableDate
          name="parentDeathDate"
          label="Date of death"
          error={
            formSubmitted && !itemData.parentDeathDate
              ? 'Provide a date of death'
              : null
          }
          monthSelect
          value={itemData.parentDeathDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where was the death?</h4>
        <VaCheckbox
          name="parentDeathOutsideUS"
          label="The death happened outside the United States"
          checked={itemData.parentDeathOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="parentDeathCity"
          label={`City${itemData.parentDeathOutsideUS ? '' : ' or county'}`}
          error={
            formSubmitted && !itemData.parentDeathCity
              ? `Enter a city${
                  itemData.parentDeathOutsideUS ? '' : ' or county'
                }`
              : null
          }
          value={itemData.parentDeathCity || ''}
          onVaInput={onChange}
          required
        />
        {itemData.parentDeathOutsideUS ? (
          <>
            <VaTextInput
              class="vads-u-margin-top--4"
              name="parentDeathProvince"
              label="Province, region or territory"
              onVaInput={onChange}
              value={itemData.parentDeathProvince || ''}
            />
            <SelectCountry
              name="parentDeathCountry"
              label="Country"
              error={
                formSubmitted && !itemData.parentDeathCountry
                  ? 'Select a country'
                  : null
              }
              onChange={onChange}
              value={itemData.parentDeathCountry || ''}
            />
          </>
        ) : (
          <SelectState
            label="State"
            name="parentDeathState"
            error={
              formSubmitted && !itemData.parentDeathState
                ? 'Select a state'
                : null
            }
            onChange={onChange}
            value={itemData.parentDeathState || ''}
          />
        )}
      </>
    );
  },
};

parentDeath.propTypes = {
  Component: PropTypes.func,
};

parentDeath.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  goBack: PropTypes.func,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    parentDeathCity: PropTypes.string,
    parentDeathCountry: PropTypes.string,
    parentDeathDate: PropTypes.string,
    parentDeathOutsideUS: PropTypes.bool,
    parentDeathProvince: PropTypes.string,
    parentDeathState: PropTypes.string,
    parentDeathType: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
  }),
};

export default parentDeath;
