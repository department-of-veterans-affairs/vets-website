import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { SelectCountry, SelectState, getValue } from './helpers';

const childDeath = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.childDeathDate ||
        !itemData.childDeathCity ||
        (!itemData.childDeathOutsideUS && !itemData.childDeathState) ||
        (itemData.childDeathOutsideUS && !itemData.childDeathCountry)
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
   * @property {string} childDeathType Dependent's removal reason
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
          name="childDeathDate"
          label="Date of death"
          error={
            formSubmitted && !itemData.childDeathDate
              ? 'Provide a date of death'
              : null
          }
          monthSelect
          value={itemData.childDeathDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where was the death?</h4>
        <VaCheckbox
          name="childDeathOutsideUS"
          label="The death happened outside the United States"
          checked={itemData.childDeathOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="childDeathCity"
          label={`City${itemData.childDeathOutsideUS ? '' : ' or county'}`}
          error={
            formSubmitted && !itemData.childDeathCity
              ? `Enter a city${
                  itemData.childDeathOutsideUS ? '' : ' or county'
                }`
              : null
          }
          value={itemData.childDeathCity || ''}
          onVaInput={onChange}
          required
        />
        {itemData.childDeathOutsideUS ? (
          <>
            <VaTextInput
              class="vads-u-margin-top--4"
              name="childDeathProvince"
              label="Province, region or territory"
              onVaInput={onChange}
              value={itemData.childDeathProvince || ''}
            />
            <SelectCountry
              name="childDeathCountry"
              label="Country"
              error={
                formSubmitted && !itemData.childDeathCountry
                  ? 'Select a country'
                  : null
              }
              onChange={onChange}
              value={itemData.childDeathCountry || ''}
            />
          </>
        ) : (
          <SelectState
            label="State"
            name="childDeathState"
            error={
              formSubmitted && !itemData.childDeathState
                ? 'Select a state'
                : null
            }
            onChange={onChange}
            value={itemData.childDeathState || ''}
          />
        )}
      </>
    );
  },
};

childDeath.propTypes = {
  Component: PropTypes.func,
};

childDeath.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  goBack: PropTypes.func,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    childDeathCity: PropTypes.string,
    childDeathCountry: PropTypes.string,
    childDeathDate: PropTypes.string,
    childDeathOutsideUS: PropTypes.bool,
    childDeathProvince: PropTypes.string,
    childDeathState: PropTypes.string,
    childDeathType: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
  }),
};

export default childDeath;
