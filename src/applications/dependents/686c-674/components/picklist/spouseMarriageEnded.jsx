import React from 'react';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  VaCheckbox,
  VaRadio,
  VaRadioOption,
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

const spouseMarriageEnded = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: (/* { _itemData, _index, _fullData } */) => 'DONE',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      const hasError = getPastDateError(itemData.endDate);
      if (
        !itemData.endType ||
        (itemData.endType === 'annulmentOrVoid' &&
          !itemData.endAnnulmentOrVoidDescription) ||
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
          {isEditing ? 'Edit information' : 'Information'} about the end of your
          marriage to{' '}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {firstName}
          </span>
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
                <VaTextInput
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
        <PastDate
          label="Date marriage ended"
          date={itemData.endDate}
          formSubmitted={formSubmitted}
          missingErrorMessage="Enter the date marriage ended"
          onChange={onChange}
        />

        <h4>Where did the marriage end?</h4>
        <VaCheckbox
          name="endOutsideUs"
          label="Marriage ended outside the United States"
          checked={itemData.endOutsideUs || false}
          onVaChange={onChange}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="endCity"
          label={itemData.endOutsideUs ? 'City' : 'City or county'}
          error={
            formSubmitted && !itemData.endCity ? 'Enter a city or county' : null
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

spouseMarriageEnded.propTypes = propTypes.Page;
spouseMarriageEnded.Component.propTypes = propTypes.Component;

export default spouseMarriageEnded;
