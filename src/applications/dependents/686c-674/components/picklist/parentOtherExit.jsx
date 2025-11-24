import React from 'react';

import propTypes from './types';

const parentOtherExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

    // Submit is ignored if the exit form button is visible
    onSubmit: ({ goForward }) => {
      goForward();
    },
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

  /** @type {PicklistComponentProps} */
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

      <va-additional-info trigger="How can I remove a dependent parent for reasons other than death?">
        <p>
          You can only use this form to remove a dependent parent if they died.
          If your parent is still living and you want to remove them as a
          dependent, call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ).
        </p>
      </va-additional-info>
    </>
  ),
};

parentOtherExit.propTypes = propTypes.Page;
parentOtherExit.Component.propTypes = propTypes.Component;

export default parentOtherExit;
