import React from 'react';
import { connect } from 'react-redux';
import captureEvents from '../analytics-functions';
import { isChapter33 } from '../helpers';

function InitialConfirmEligibilityView(props) {
  if (props.onReviewPage) {
    return null;
  }
  captureEvents.ineligibilityAlert(props);

  return (
    <div role="alert">
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
          className={'usa-button-primary va-button-primary'}
          href="/education/"
          target="_self"
          onClick={captureEvents.exitApplication}
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
  isChapter33: isChapter33(state.form.data),
  benefitLeft: state?.form?.data.benefitLeft,
  isEnrolledStem: state?.form?.data.isEnrolledStem,
  isPursuingTeachingCert: state?.form?.data?.isPursuingTeachingCert || false,
});

export default connect(mapStateToProps)(InitialConfirmEligibilityView);
