import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isChapter33 } from '../helpers';
import captureEvents from '../analytics-functions';
import { ExitApplicationButton } from '../components/ExitApplicationButton';

export const CEVIcon = ({ indication }) => {
  const icon = indication ? 'check' : 'close';
  const classes = classNames('icon-li', {
    'vads-u-color--green': indication,
    'vads-u-color--gray-medium': !indication,
  });
  return (
    <span className={classes}>
      <va-icon icon={icon} size={3} />
    </span>
  );
};

export class ConfirmEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({ ...this.props.formData, ...property });
  };

  iconText = indication =>
    indication ? `You answered yes to` : `You answered no to`;

  renderCheck = (indication, title, text) => (
    <li className="vads-u-position--relative">
      <CEVIcon indication={indication} />
      <span className="vads-u-visibility--screen-reader">{title}</span>
      {text}
    </li>
  );

  renderBenefitCheck = () => {
    const check = this.props.isChapter33;
    const text =
      'Are using or recently used Post-9/11 GI Bill or Fry Scholarship benefits';
    const title = this.iconText(check);

    return this.renderCheck(check, title, text);
  };

  renderBenefitLeftCheck = () => {
    const { benefitLeft } = this.props;
    const check = benefitLeft !== 'moreThanSixMonths';
    const text =
      'Have used all of your education benefits or are within 6 months of using all your benefits when you submit your application';
    const title = this.iconText(check);

    return this.renderCheck(check, title, text);
  };

  renderEnrolledCheck = () => {
    const {
      isEnrolledStem,
      isPursuingTeachingCert,
      isPursuingClinicalTraining,
    } = this.props;
    const check =
      isEnrolledStem || isPursuingTeachingCert || isPursuingClinicalTraining;
    const textElement = (
      <div>
        <span className="vads-u-margin-bottom--neg1px">Are:</span>
        <br />
        <ul className="circle vads-u-margin-y--0">
          <li className="vads-u-margin-y--0">
            Enrolled in a bachelor’s degree program for science, technology,
            engineering, or math (STEM), <b>or</b>
          </li>
          <li className="vads-u-margin-y--0">
            Have already earned a STEM bachelor’s degree and are working toward
            a teaching certification, <b>or</b>
          </li>
          <li className="vads-u-margin-y--0">
            Have already earned a STEM bachelor’s or graduate degree and are
            pursuing a covered clinical training program for health care
            professionals
          </li>
        </ul>
      </div>
    );
    const title = this.iconText(check);

    return this.renderCheck(check, title, textElement);
  };

  renderChecks = () => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div tabIndex={0}>
      <div className="vads-u-margin-top--neg2p5">
        <h4>Based on your responses, you may not be eligible</h4>
      </div>
      <div className="vads-u-margin-right--neg7 vads-u-padding-top--1p5">
        <b>Your responses:</b>
      </div>
      <ul className="vads-u-padding-left--0 vads-u-margin-left--3 vads-u-margin-top--0p5 stem-eligibility-ul">
        {this.renderBenefitCheck()}
        {this.renderEnrolledCheck()}
        {this.renderBenefitLeftCheck()}
      </ul>
    </div>
  );

  renderErrorMessage = () => {
    const { errors, showErrors } = this.props;
    if (showErrors) {
      return (
        <div>
          {errors.map(error => (
            <span key={error} className="usa-input-error-message" role="alert">
              {error}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

  renderConfirmEligibility = () => {
    return (
      <div>
        {this.props.remainingEntitlement &&
          this.props.remainingEntitlement.totalDays > 180 && (
            <div>
              <div className="usa-alert usa-alert-warning vads-u-background-color--white">
                <div className="usa-alert-body">
                  <strong>Your remaining education benefits</strong>
                  <div className="usa-alert-text">
                    <p>
                      You must have less than 6 months left of Post-9/11 GI Bill
                      benefits when you submit your application. Our system
                      shows you have{' '}
                      <b>{this.props.remainingEntitlement.months} months</b>,{' '}
                      <b>{this.props.remainingEntitlement.days} days</b>{' '}
                      remaining of GI Bill benefits.
                    </p>{' '}
                    <p> If you apply now, your application will be denied.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  renderHeader = () => {
    return (
      <div className="vads-u-padding-bottom--1">
        <h3>Rogers STEM Scholarship eligibility summary</h3>
      </div>
    );
  };

  render() {
    captureEvents.ineligibilityAlert(this.props);
    return (
      <div>
        {this.renderHeader()}
        <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2">
          {this.renderChecks()}
          {this.renderConfirmEligibility()}
        </div>
        {/*  eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="vads-u-padding-y--4" tabIndex={0}>
          <b>
            You must meet the above requirements to qualify for the scholarship.
          </b>{' '}
          Please consider that ineligible applications delay the processing of
          benefits for eligible applicants.
        </div>
        <div>
          <div className="vads-u-margin-top--neg2">
            <ExitApplicationButton
              formId={this.props.formId}
              isLoggedIn={this.props.isLoggedIn}
            />
          </div>

          <div>
            <p>
              If you'd still like to apply, you can continue with your
              application.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const confirmEligibility = ownProps?.formData['view:confirmEligibility'];
  const errors =
    ownProps?.errorSchema['view:confirmEligibility']?.__errors || [];

  return {
    remainingEntitlement: state.form.data['view:remainingEntitlement'],
    isChapter33: isChapter33(state.form.data),
    benefitLeft: state?.form?.data.benefitLeft,
    isEnrolledStem: state?.form?.data.isEnrolledStem,
    isPursuingTeachingCert:
      state?.form?.data['view:teachingCertClinicalTraining']
        ?.isPursuingTeachingCert || false,
    isPursuingClinicalTraining:
      state?.form?.data['view:teachingCertClinicalTraining']
        ?.isPursuingClinicalTraining || false,
    confirmEligibility,
    errors,
    showErrors:
      errors.length > 0 &&
      ownProps?.formContext?.submitted &&
      confirmEligibility === undefined,
    formId: state.form.formId,
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmEligibilityView);
