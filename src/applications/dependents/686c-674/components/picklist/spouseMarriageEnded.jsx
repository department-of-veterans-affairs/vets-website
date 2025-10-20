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
        !itemData.marriageEndType ||
        (itemData.marriageEndType === 'annulmentOrVoid' &&
          !itemData.marriageEndAnnulmentOrVoidDescription) ||
        !itemData.marriageEndDate ||
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
          Information about the end of your marriage to {firstName}
        </h3>

        <div className="vads-u-margin-bottom--2">
          <VaRadio
            name="marriageEndType"
            error={
              formSubmitted && !itemData.marriageEndType
                ? 'Select an option'
                : null
            }
            label="How did the marriage end?"
            labelHeaderLevel="4"
            onVaValueChange={onChange}
            required
          >
            <VaRadioOption
              name="marriageEndType"
              label="Divorce"
              checked={itemData.marriageEndType === 'divorce'}
              value="divorce"
            />
            <VaRadioOption
              name="marriageEndType"
              label="Annulment or declared void"
              checked={itemData.marriageEndType === 'annulmentOrVoid'}
              value="annulmentOrVoid"
            />
          </VaRadio>
          {itemData.marriageEndType === 'annulmentOrVoid' && (
            <div className="vads-u-padding-left--4">
              <div className="form-expanding-group-open">
                <va-text-input
                  name="marriageEndAnnulmentOrVoidDescription"
                  error={
                    formSubmitted &&
                    !itemData.marriageEndAnnulmentOrVoidDescription
                      ? 'Enter a response'
                      : null
                  }
                  label="Briefly describe how the marriage ended"
                  value={itemData.marriageEndAnnulmentOrVoidDescription || ''}
                  onVaInput={onChange}
                  required
                />
              </div>
            </div>
          )}
        </div>

        <h4>When did the marriage end?</h4>
        <VaMemorableDate
          name="marriageEndDate"
          label="Date marriage ended"
          error={
            formSubmitted && !itemData.marriageEndDate
              ? 'Provide a date marriage ended'
              : null
          }
          monthSelect
          value={itemData.marriageEndDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />

        <h4>Where did the marriage end?</h4>
        <VaCheckbox
          name="marriageEndOutsideUS"
          label="The marriage ended outside the United States"
          checked={itemData.marriageEndOutsideUS || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="marriageEndCity"
          label={itemData.marriageEndOutsideUS ? 'City' : 'City or county'}
          error={
            formSubmitted && !itemData.marriageEndCity
              ? 'Enter a city or county'
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
              value={itemData.marriageEndProvince || ''}
              onVaInput={onChange}
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
            name="marriageEndState"
            label="State"
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
    marriageEndType: PropTypes.string,
    marriageEndAnnulmentOrVoidDescription: PropTypes.string,
    marriageEndDate: PropTypes.string,
    marriageEndCity: PropTypes.string,
    marriageEndState: PropTypes.string,
    marriageEndCountry: PropTypes.string,
    marriageEndProvince: PropTypes.string,
    marriageEndOutsideUS: PropTypes.bool,
  }),
};

export default spouseMarriageEnded;
