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
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        can’t be removed using this application
      </h3>

      <p>
        Because you can only remove a parent who has died,{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        will remain on your benefits.
      </p>

      {isShowingExitLink && (
        <p>If you exit now, we’ll cancel the application you started.</p>
      )}

      <va-additional-info trigger="Why can I only remove a parent dependent if they have died?">
        <p>
          The only removal option for a parent allowed in this form is due to
          death. If your parent is still living and you need to make changes to
          your benefits, call us at <va-telephone contact="8008271000" /> (
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
