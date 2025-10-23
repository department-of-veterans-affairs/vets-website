import React from 'react';
import { connect } from 'react-redux';
import captureEvents from '../analytics-functions';
import { isChapter33 } from '../helpers';
import { ExitApplicationButton } from '../components/ExitApplicationButton';

function InitialConfirmEligibilityView(props) {
  if (props.onReviewPage) {
    return null;
  }
  captureEvents.ineligibilityAlert(props);

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex="0">
        <div className="usa-alert usa-alert-warning" role="alert">
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
        <ExitApplicationButton
          formId={props.formId}
          isLoggedIn={props.isLoggedIn}
        />
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
  isPursuingTeachingCert:
    state?.form?.data['view:teachingCertClinicalTraining']
      ?.isPursuingTeachingCert || false,
  isPursuingClinicalTraining:
    state?.form?.data['view:teachingCertClinicalTraining']
      ?.isPursuingClinicalTraining || false,
  formId: state.form.formId,
  isLoggedIn: state.user.login.currentlyLoggedIn,
});

export default connect(mapStateToProps)(InitialConfirmEligibilityView);
