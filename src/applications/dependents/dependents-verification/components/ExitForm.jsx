import React from 'react';
import PropTypes from 'prop-types';
import { getAppUrl } from 'platform/utilities/registry-helpers';

const form686Url = getAppUrl('686C-674');

const NavButtons = () => {
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      <div className="small-6 medium-5 columns">
        <button
          type="button"
          className="usa-button usa-button-secondary"
          onClick={() => window.history.back()}
        >
          <span aria-hidden="true">«</span>
          &nbsp;Back
        </button>
      </div>
      <div className="small-6 medium-5 end columns">
        <a className="usa-button" href={form686Url}>
          Go to add or remove dependents form&nbsp;
          <span aria-hidden="true">»</span>
        </a>
      </div>
    </div>
  );
};

export const ExitForm = () => {
  return (
    <>
      <h1>Update your dependents in a different form</h1>

      <p>
        <strong>VA Forms 21-686c and 21-674</strong>
      </p>

      <p>
        Because you told us you need to update your dependents, we need you to
        use a different online form. This form will help you add or remove
        dependents.
      </p>

      <p>
        We encourage you to make these updates now so we pay you the right
        benefit amount. If your dependents’ information isn’t correct, this
        could lead to a benefit overpayment. Then, you’d have to repay the extra
        money.
      </p>

      <p>
        After you get your decision letter for the dependents you updated, come
        back here to verify all your dependents.
      </p>

      <NavButtons />
    </>
  );
};

ExitForm.propTypes = {
  contentBeforeButtons: PropTypes.node.isRequired,
  contentAfterButtons: PropTypes.node.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
};
