import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getValue, scrollToError } from './helpers';
import propTypes from './types';

const stepchildLivesWith = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: () => 'stepchild-left-household',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (
        !itemData.whoDoesTheStepchildLiveWith?.first ||
        !itemData.whoDoesTheStepchildLiveWith?.last
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
      handlers.onChange({
        ...itemData,
        whoDoesTheStepchildLiveWith: {
          ...(itemData.whoDoesTheStepchildLiveWith || {}),
          [field]: value,
        },
      });
    };

    return (
      <>
        <h3 className="vads-u-margin-bottom--4">
          {`${isEditing ? 'Editing who' : 'Who'} does `}
          <span className="dd-privacy-mask" data-dd-action-name="first name">
            {firstName}
          </span>{' '}
          live with?
        </h3>
        <VaTextInput
          class="vads-u-margin-top--4"
          name="first"
          label="Parent or guardian’s first name"
          onVaInput={onChange}
          value={itemData.whoDoesTheStepchildLiveWith?.first || ''}
          error={
            formSubmitted && !itemData.whoDoesTheStepchildLiveWith?.first
              ? 'Enter a first name'
              : null
          }
          required
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="middle"
          label="Parent or guardian’s middle name"
          onVaInput={onChange}
          value={itemData.whoDoesTheStepchildLiveWith?.middle || ''}
        />
        <VaTextInput
          class="vads-u-margin-top--4"
          name="last"
          label="Parent or guardian’s last name"
          onVaInput={onChange}
          value={itemData.whoDoesTheStepchildLiveWith?.last || ''}
          error={
            formSubmitted && !itemData.whoDoesTheStepchildLiveWith?.last
              ? 'Enter a last name'
              : null
          }
          required
        />
      </>
    );
  },
};

stepchildLivesWith.propTypes = propTypes.Page;
stepchildLivesWith.Component.propTypes = propTypes.Component;

export default stepchildLivesWith;
