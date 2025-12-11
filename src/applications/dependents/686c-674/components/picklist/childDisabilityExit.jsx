import React from 'react';

import propTypes from './types';

const childDisabilityExit = {
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
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        still qualifies as your dependent
      </h3>

      <p>
        Because{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        has a permanent disability,{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        is still an eligible dependent.
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

childDisabilityExit.propTypes = propTypes.Page;
childDisabilityExit.Component.propTypes = propTypes.Component;

export default childDisabilityExit;
