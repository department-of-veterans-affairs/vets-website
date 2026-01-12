import React from 'react';

import { RemoveParentAdditionalInfo } from './helpers';
import propTypes from './types';

const parentOtherExit = {
  handlers: {
    /**
     * @type {GoForwardParams}
     * Return "DONE" when we're done with this flow
     * @returns {string} Next page key
     */
    goForward: () => 'DONE',

    /**
     * @type {OnSubmitParams}
     * @returns {void}
     */
    onSubmit: ({ goForward }) => {
      // Submit is ignored if the exit form button is visible
      goForward();
    },
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

  /**
   * @type {PicklistComponentProps}
   * @returns {React.ReactElement} Page component
   */
  Component: ({ firstName, isShowingExitLink }) => (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        You can’t use this form to remove{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>
      </h3>

      <p>
        Since you can only use this form to remove a parent who has died,{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        will remain on your benefits.
      </p>

      {isShowingExitLink && (
        <p>If you exit now, we’ll cancel the form you started.</p>
      )}

      <RemoveParentAdditionalInfo />
    </>
  ),
};

parentOtherExit.propTypes = propTypes.Page;
parentOtherExit.Component.propTypes = propTypes.Component;

export default parentOtherExit;
