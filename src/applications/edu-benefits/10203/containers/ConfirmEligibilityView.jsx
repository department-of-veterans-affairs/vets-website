import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isChapter33 } from '../helpers';
import captureEvents from '../analytics-functions';
import { ExitApplicationButton } from '../components/ExitApplicationButton';

export class ConfirmEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({
      ...this.props.formData,
      ...property,
    });
  };

  iconClass = indication =>
    classNames('fa', {
      'fa-check': indication,
      'fa-times': !indication,
      'vads-u-color--green': indication,
      'vads-u-color--gray-medium': !indication,
    });

  iconText = indication =>
    indication ? `You answered yes to` : `You answered no to`;

  renderCheck = (classes, iconTitle, title, text) => (
    <li className="vads-u-margin-bottom--0">
      <span className="fa-li">
        <i className={classes} aria-hidden="true" title={iconTitle} />
      </span>
      <span className="vads-u-visibility--screen-reader">{title}</span>
      {text}
    </li>
  );

  renderBenefitCheck = () => {
    const check = this.props.isChapter33;
    const text =
      'Are using or recently used Post-9/11 GI Bill or Fry Scholarship benefits';
    const title = this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(this.iconClass(check), iconTitle, title, text);
  };

  renderBenefitLeftCheck = () => {
    const { benefitLeft } = this.props;
    const check = benefitLeft !== 'moreThanSixMonths';
    const text =
      'Have used all of your education benefits or are within 6 months of using all your benefits when you submit your application';
    const title = this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(this.iconClass(check), iconTitle, title, text);
  };

  renderEnrolledCheck = () => {
    const { isEnrolledStem, isPursuingTeachingCert } = this.props;
    const check = isEnrolledStem || isPursuingTeachingCert;
    const text = (
      <div>
        Are enrolled in a bachelor’s degree program for science, technology,
        engineering, or math (STEM), <b>or</b> have already earned a STEM
        bachelor’s degree and are pursuing a teaching certification
      </div>
    );
    const title = this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(this.iconClass(check), iconTitle, title, text);
  };

  renderChecks = () => (
    <div role="alert">
      <div className="vads-u-margin-top--neg2p5">
        <h4>Based on your responses, you may not be eligible</h4>
      </div>
      <div className="vads-u-margin-right--neg7 vads-u-padding-top--1p5">
        <b>Your responses:</b>
      </div>
      <ul className="fa-ul vads-u-margin-left--3 vads-u-margin-top--0p5 stem-eligibility-ul">
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
                      Our entitlement system shows that you have more than 6
                      months of education benefits remaining. You should apply
                      when you have less than 6 months of entitlement left.
                    </p>
                    <p>
                      Months you have left to use:{' '}
                      <strong>
                        {this.props.remainingEntitlement.months} months,{' '}
                        {this.props.remainingEntitlement.days} days{' '}
                      </strong>
                    </p>
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
        <div className="vads-u-padding-y--4">
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
    isPursuingTeachingCert: state?.form?.data?.isPursuingTeachingCert || false,
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
