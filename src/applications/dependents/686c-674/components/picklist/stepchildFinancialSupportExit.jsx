import React from 'react';

import propTypes from './types';

import { makeNamePossessive } from '../../../shared/utils';

const stepchildFinancialSupportExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

    // Submit shouldn't do anything; we're directing the user to exit the form
    onSubmit: ({ goForward }) => {
      goForward();
    },
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

  /** @type {PicklistComponentProps} */
  Component: ({ firstName }) => (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        still qualifies as your dependent
      </h3>

      <p
        className="dd-privacy-mask"
        data-dd-action-name="child is still an eligible dependent"
      >
        Because you provide at least half of {makeNamePossessive(firstName)}{' '}
        financial support, {firstName} is an eligible dependent.
      </p>

      <p
        className="dd-privacy-mask"
        data-dd-action-name="child will remain on your benefits"
      >
        {firstName} will remain on your benefits.
      </p>

      <p>If you exit now, we’ll cancel the application you started.</p>
    </>
  ),
};

stepchildFinancialSupportExit.propTypes = propTypes.Page;
stepchildFinancialSupportExit.Component.propTypes = propTypes.Component;

export default stepchildFinancialSupportExit;
