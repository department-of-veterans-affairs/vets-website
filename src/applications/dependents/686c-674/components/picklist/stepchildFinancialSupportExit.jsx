import React from 'react';

import propTypes from './types';

import { makeNamePossessive } from '../../../shared/utils';

const stepchildFinancialSupportExit = {
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
      // Submit shouldn't do anything; we're directing the user to exit the form
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
        Because you provide at least half of
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {` ${makeNamePossessive(firstName)}`}
        </span>{' '}
        financial support, {firstName} is an eligible dependent.
      </p>

      <p>
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        will remain on your benefits.
      </p>

      {isShowingExitLink && (
        <p>If you exit now, we’ll cancel the application you started.</p>
      )}
    </>
  ),
};

stepchildFinancialSupportExit.propTypes = propTypes.Page;
stepchildFinancialSupportExit.Component.propTypes = propTypes.Component;

export default stepchildFinancialSupportExit;
