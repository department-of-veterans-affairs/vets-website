import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isChapter33 } from '../helpers';
import captureEvents from '../analytics-functions';

export class ConfirmEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({
      ...this.props.formData,
      ...property,
    });
  };

  inReviewEditMode = () => this.props.onReviewPage && this.props.reviewMode;
  showNotApplyingToStemInformation = () =>
    !this.props.onReviewPage &&
    this.props.confirmEligibility !== undefined &&
    !this.props.confirmEligibility;

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
      'Have used all of your education benefits or are within 6 months of doing so when you submit your application';
    const title = this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(this.iconClass(check), iconTitle, title, text);
  };

  renderEnrolledCheck = () => {
    const { isEnrolledStem, isPursuingTeachingCert } = this.props;
    const check = isEnrolledStem || isPursuingTeachingCert;
    const text =
      'Are enrolled in an undergraduate degree for science, technology, engineering, or math (STEM) requiring at least 120 semester (or 180 quarter) credit hours for completion, or have already earned an undergraduate STEM degree and are pursuing a teaching certification';
    const title = this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(this.iconClass(check), iconTitle, title, text);
  };

  renderChecks = () => (
    <div>
      <p className="vads-u-margin-bottom--1">
        <span className="vads-u-font-family--serif heading-level-4">
          Based on your responses, it appears you’re not eligible for the Rogers
          STEM Scholarship.
        </span>
        <br />
        <br />
        <b>Your responses:</b>
      </p>
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
    const { showErrors, confirmEligibility } = this.props;
    const id = 'root_confirmEligibility';
    const divClassName = classNames(
      'form-radio-buttons',
      showErrors ? 'usa-input-error' : '',
    );
    const legendClassName = classNames(
      'schemaform-label',
      showErrors ? 'usa-input-error-label' : '',
    );
    const questionText =
      'Would you still like to apply and let us determine your eligibility?';

    if (this.inReviewEditMode()) {
      let value;
      if (confirmEligibility !== undefined) {
        value = confirmEligibility ? 'Yes' : 'No';
      }

      return (
        <dl className="review">
          <div className="review-row">
            <dt>{questionText}</dt>
            <dd>
              <span>{value}</span>
            </dd>
          </div>
        </dl>
      );
    }

    return (
      <div className={divClassName}>
        <div className={'vads-u-padding-bottom--2'}>
          {this.props.remainingEntitlement &&
            this.props.remainingEntitlement.totalDays > 180 && (
              <div>
                <div className="usa-alert usa-alert-warning vads-u-background-color--white">
                  <div className="usa-alert-body">
                    <strong>Your remaining education benefits</strong>
                    <div className="usa-alert-text">
                      <p>
                        Our entitlement system shows that you have more than 6
                        months of education benefits remaining. You can apply
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
                <br />
              </div>
            )}
          <span>
            If your situation changes in the future and you meet all of the
            criteria, you may return to apply for the Rogers STEM Scholarship.
          </span>
          <div className="vads-u-padding-top--2">
            <a
              className={'usa-button-primary wizard-button va-button-primary'}
              href="/education/about-gi-bill-benefits/"
            >
              Explore other education benefits
            </a>
          </div>
        </div>

        <div>
          <fieldset className="schemaform-field-template schemaform-first-field">
            <legend className={legendClassName}>
              {questionText}
              <span className="schemaform-required-span">(*Required)</span>
            </legend>
            {this.renderErrorMessage()}
            <input
              type="radio"
              checked={confirmEligibility === false}
              id={`${id}No`}
              name={`${id}`}
              value="N"
              onChange={() =>
                this.onChange({ 'view:confirmEligibility': false })
              }
              onClick={() => captureEvents.ineligibilityStillApply(false)}
            />
            <label htmlFor={`${id}No`}>No</label>
            <input
              type="radio"
              checked={confirmEligibility === true}
              id={`${id}Yes`}
              name={`${id}`}
              value="Y"
              onChange={() =>
                this.onChange({ 'view:confirmEligibility': true })
              }
              onClick={() => {
                captureEvents.ineligibilityStillApply(true);
              }}
            />
            <label htmlFor={`${id}Yes`}>Yes</label>
          </fieldset>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2">
          {this.renderChecks()}
          {this.renderConfirmEligibility()}
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
    reviewMode: ownProps?.formContext?.reviewMode,
    onReviewPage: ownProps?.formContext?.onReviewPage,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmEligibilityView);
