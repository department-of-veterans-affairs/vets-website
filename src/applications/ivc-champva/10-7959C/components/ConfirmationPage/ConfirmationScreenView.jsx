import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';

const ConfirmationScreenView = ({ beneficiary, signee, submitDate }) => {
  useEffect(() => focusElement('h2', {}, 'va-alert'), []);

  return (
    <>
      <va-alert status="success" class="vads-u-margin-bottom--4">
        <h2 slot="headline" className="vads-u-font-size--h3">
          You’ve submitted your CHAMPVA Other Health Insurance Certification
          form
        </h2>
      </va-alert>

      <va-summary-box class="vads-u-margin-bottom--4">
        <h3 slot="headline">Your submission information</h3>

        <h4>Beneficiary’s name</h4>
        <p className="dd-privacy-mask" data-dd-action-name="Beneficiary">
          {beneficiary}
        </p>

        <h4>Who submitted this form</h4>
        <p className="dd-privacy-mask" data-dd-action-name="Signee">
          {signee}
        </p>

        {submitDate && (
          <>
            <h4>Date submitted</h4>
            <p
              className="dd-privacy-mask"
              data-dd-action-name="Submission date"
            >
              {submitDate}
            </p>
          </>
        )}

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records.</p>

        <div className="vads-u-margin-top--2">
          <va-button text="Print this page" onClick={() => window.print()} />
        </div>
      </va-summary-box>
    </>
  );
};

ConfirmationScreenView.propTypes = {
  beneficiary: PropTypes.string,
  signee: PropTypes.string,
  submitDate: PropTypes.string,
};

export default ConfirmationScreenView;
