import React from 'react';

import propTypes from './types';

const childAdoptedExit = {
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
        If this child was adopted by another family, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ).
      </p>

      <p>
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        will remain on your benefits.
      </p>

      {isShowingExitLink && (
        <p>If you exit now, we’ll cancel the form you started.</p>
      )}
    </>
  ),
};

childAdoptedExit.propTypes = propTypes.Page;
childAdoptedExit.Component.propTypes = propTypes.Component;

export default childAdoptedExit;
