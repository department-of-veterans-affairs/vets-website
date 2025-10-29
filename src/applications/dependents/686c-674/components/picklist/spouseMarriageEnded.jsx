import React from 'react';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import {
  VaCheckbox,
  VaMemorableDate,
  VaRadio,
  VaRadioOption,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { SelectCountry, SelectState, getValue } from './helpers';

const spouseMarriageEnded = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { _itemData, _index, _fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.endType ||
        (itemData.endType === 'annulmentOrVoid' &&
          !itemData.endAnnulmentOrVoidDescription) ||
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
   * @property {string} endType Dependent's removal reason
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
          Information about the end of your marriage to {firstName}
        </h3>

        <div className="vads-u-margin-bottom--2">
          <VaRadio
            name="endType"
            error={
              formSubmitted && !itemData.endType ? 'Select an option' : null
            }
            label="How did the marriage end?"
            labelHeaderLevel="4"
            onVaValueChange={onChange}
            required
          >
            <VaRadioOption
              name="endType"
              label="Divorce"
              checked={itemData.endType === 'divorce'}
              value="divorce"
            />
            <VaRadioOption
              name="endType"
              label="Annulment or declared void"
              checked={itemData.endType === 'annulmentOrVoid'}
              value="annulmentOrVoid"
            />
          </VaRadio>
          {itemData.endType === 'annulmentOrVoid' && (
            <div className="vads-u-padding-left--4">
              <div className="form-expanding-group-open">
                <va-text-input
                  name="endAnnulmentOrVoidDescription"
                  error={
                    formSubmitted && !itemData.endAnnulmentOrVoidDescription
                      ? 'Enter a response'
                      : null
                  }
                  label="Briefly describe how the marriage ended"
                  value={itemData.endAnnulmentOrVoidDescription || ''}
                  onVaInput={onChange}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <h4>When did the marriage end?</h4>
        <VaMemorableDate
          name="endDate"
          label="Date marriage ended"
          error={
            formSubmitted && !itemData.endDate
              ? 'Provide a date marriage ended'
              : null
          }
          monthSelect
          value={itemData.endDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where did the marriage end?</h4>
        <VaCheckbox
          name="endOutsideUS"
          label="The marriage ended outside the United States"
          checked={itemData.endOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="endCity"
          label={itemData.endOutsideUS ? 'City' : 'City or county'}
          error={
            formSubmitted && !itemData.endCity ? 'Enter a city or county' : null
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
              value={itemData.endProvince || ''}
              onVaInput={onChange}
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
            name="endState"
            label="State"
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

spouseMarriageEnded.propTypes = {
  Component: PropTypes.func,
};

spouseMarriageEnded.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  goBack: PropTypes.func,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    dateOfBirth: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
    endType: PropTypes.string,
    endAnnulmentOrVoidDescription: PropTypes.string,
    endDate: PropTypes.string,
    endCity: PropTypes.string,
    endState: PropTypes.string,
    endCountry: PropTypes.string,
    endProvince: PropTypes.string,
    endOutsideUS: PropTypes.bool,
  }),
};

export default spouseMarriageEnded;
