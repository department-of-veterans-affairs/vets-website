import React from 'react';
import { connect } from 'react-redux';

function InitialConfirmEligibilityView(props) {
  if (props.onReviewPage) {
    return null;
  }
  return (
    <div>
      <div>
        <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h4 className="usa-alert-heading">
              Based on your response, you may not be eligible
            </h4>
            <div className="usa-alert-text">
              <p>
                <strong>
                  You must be a Post-9/11 GI Bill or Fry Scholarship beneficiary
                  to qualify for the scholarship.
                </strong>{' '}
                Please consider that ineligible applications delay the
                processing of benefits for eligible applicants.
              </p>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div>
        <a
          className={'usa-button-primary wizard-button va-button-primary'}
          href="/education/"
          target="_self"
        >
          Exit application
        </a>
      </div>
      <br />
      <span>
        If you'd still like to apply, you can continue with your application.
      </span>
    </div>
  );
}

const mapStateToProps = (state, props) => ({
  onReviewPage: props?.formContext?.onReviewPage,
});

export default connect(mapStateToProps)(InitialConfirmEligibilityView);
