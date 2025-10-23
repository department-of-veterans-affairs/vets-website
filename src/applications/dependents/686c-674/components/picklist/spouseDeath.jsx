import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { SelectCountry, SelectState, getValue } from './helpers';

const spouseDeath = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.marriageEndDeathDate ||
        !itemData.marriageEndCity ||
        (!itemData.marriageEndOutsideUS && !itemData.marriageEndState) ||
        (itemData.marriageEndOutsideUS && !itemData.marriageEndCountry)
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
   * @property {string} marriageEndType Dependent's removal reason
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
          name="marriageEndDeathDate"
          label="Date of death"
          error={
            formSubmitted && !itemData.marriageEndDeathDate
              ? 'Provide a date of death'
              : null
          }
          monthSelect
          value={itemData.marriageEndDeathDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where did the death happen?</h4>
        <VaCheckbox
          name="marriageEndOutsideUS"
          label="The death happened outside the United States"
          checked={itemData.marriageEndOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="marriageEndCity"
          label={`City${itemData.marriageEndOutsideUS ? '' : ' or county'}`}
          error={
            formSubmitted && !itemData.marriageEndCity
              ? `Enter a city${
                  itemData.marriageEndOutsideUS ? '' : ' or county'
                }`
              : null
          }
          value={itemData.marriageEndCity || ''}
          onVaInput={onChange}
          required
        />
        {itemData.marriageEndOutsideUS ? (
          <>
            <VaTextInput
              class="vads-u-margin-top--4"
              name="marriageEndProvince"
              label="Province, region or territory"
              onVaInput={onChange}
              value={itemData.marriageEndProvince || ''}
            />
            <SelectCountry
              name="marriageEndCountry"
              label="Country"
              error={
                formSubmitted && !itemData.marriageEndCountry
                  ? 'Select a country'
                  : null
              }
              onChange={onChange}
              value={itemData.marriageEndCountry || ''}
            />
          </>
        ) : (
          <SelectState
            label="State"
            name="marriageEndState"
            error={
              formSubmitted && !itemData.marriageEndState
                ? 'Select a state'
                : null
            }
            onChange={onChange}
            value={itemData.marriageEndState || ''}
          />
        )}
      </>
    );
  },
};

spouseDeath.propTypes = {
  Component: PropTypes.func,
};

spouseDeath.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  goBack: PropTypes.func,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    marriageEndCity: PropTypes.string,
    marriageEndCountry: PropTypes.string,
    marriageEndDeathDate: PropTypes.string,
    marriageEndOutsideUS: PropTypes.bool,
    marriageEndProvince: PropTypes.string,
    marriageEndState: PropTypes.string,
    marriageEndType: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
  }),
};

export default spouseDeath;
