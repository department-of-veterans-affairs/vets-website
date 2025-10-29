import React from 'react';

import { VA_FORM_IDS } from 'platform/forms/constants';

import propTypes from './types';

import ExitForm from '../../../shared/components/ExitFormLink';

const parentOtherExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

    // Submit shouldn't do anything; we're directing the user to exit the form
    onSubmit: () => {},
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

  /** @type {PicklistComponentProps} */
  Component: ({ firstName, isEditing }) => (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        {`${isEditing ? 'Edit changes' : 'Changes'} to ${firstName}`}
      </h3>

      <p>
        Since you can only remove a parent if they have died,{' '}
        <strong>
          we will not apply any changes to {firstName} and will remain on your
          benefits.
        </strong>
      </p>

      <va-additional-info trigger="Why can I only remove a parent dependent if they have died?">
        <p>
          The only removal option for a parent allowed in this form is due to
          death. If your parent is still living and you need to make changes to
          your benefits, call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ).
        </p>
      </va-additional-info>

      <div className="vads-u-margin-top--4">
        <ExitForm
          formId={VA_FORM_IDS.FORM_21_686CV2}
          href="/manage-dependents/view"
        />
      </div>
    </>
  ),
};

parentOtherExit.propTypes = propTypes.Page;
parentOtherExit.Component.propTypes = propTypes.Component;

export default parentOtherExit;
