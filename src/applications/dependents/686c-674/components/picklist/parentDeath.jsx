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

        <h4>Where was the death?</h4>
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
    endCity: PropTypes.string,
    endCountry: PropTypes.string,
    endDate: PropTypes.string,
    endOutsideUS: PropTypes.bool,
    endProvince: PropTypes.string,
    endState: PropTypes.string,
    endType: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
  }),
};

export default parentDeath;
