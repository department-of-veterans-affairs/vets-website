import React from 'react';

import propTypes from './types';

const childAdoptedExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

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
        Call the VA to remove{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>
      </h3>

      <p>
        This form does not currently allow removal of a child who was adopted by
        another family.
      </p>
      <p>
        To remove{' '}
        <span className="dd-privacy-mask" data-dd-action-name="first name">
          {firstName}
        </span>{' '}
        and avoid potential overpayments, call us at{' '}
        <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ).
      </p>

      {isShowingExitLink && (
        <p>If you exit now, we’ll cancel the application you started.</p>
      )}
    </>
  ),
};

childAdoptedExit.propTypes = propTypes.Page;
childAdoptedExit.Component.propTypes = propTypes.Component;

export default childAdoptedExit;
