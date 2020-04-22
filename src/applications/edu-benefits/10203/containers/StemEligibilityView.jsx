import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isChapter33 } from '../helpers';
import captureEvents from '../analytics-functions';

export class StemEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({
      ...this.props.formData,
      ...property,
    });
  };

  inReviewEditMode = () => this.props.onReviewPage && this.props.reviewMode;
  showNotApplyingToStemInformation = () =>
    !this.props.onReviewPage &&
    this.props.determineEligibility !== undefined &&
    !this.props.determineEligibility;

  iconClass = indication =>
    classNames('fa', {
      'fa-check': indication,
      'vads-u-color--green': indication,
      'fa-times': !indication,
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

  renderIsEdithNourseRogersScholarshipCheck = () => {
    const { isEdithNourseRogersScholarship, benefit } = this.props;
    const check = isEdithNourseRogersScholarship && isChapter33({ benefit });
    const question = isEdithNourseRogersScholarship && benefit === undefined;

    const classes = question
      ? 'fa fa-question vads-u-color--gray-medium'
      : this.iconClass(check);

    const text = 'Post-9/11 GI Bill beneficiary or Fry Scholarship recipient';
    const title = question ? `You didn't answer` : this.iconText(check);
    const iconTitle = `${title} ${text}`;

    return this.renderCheck(classes, iconTitle, title, text);
  };

  renderExhaustionOfBenefitsCheck = () => {
    const {
      exhaustionOfBenefits,
      exhaustionOfBenefitsAfterPursuingTeachingCert,
    } = this.props;

    const exhaustionOfBenefitsCheck =
      exhaustionOfBenefits || exhaustionOfBenefitsAfterPursuingTeachingCert;
    const exhaustionOfBenefitsText =
      'Have used all your education benefits or are within 6 months of doing so';
    const title = this.iconText(exhaustionOfBenefitsCheck);
    const iconTitle = `${title} ${exhaustionOfBenefitsText}`;

    return this.renderCheck(
      this.iconClass(exhaustionOfBenefitsCheck),
      iconTitle,
      title,
      exhaustionOfBenefitsText,
    );
  };

  renderIsEnrolledStemCheck = () => {
    const { isEnrolledStem, isPursuingTeachingCert } = this.props;

    const isEnrolledStemCheck = isEnrolledStem || isPursuingTeachingCert;

    const isEnrolledStemText = (
      <span>
        Are enrolled in a STEM undergraduate degree program, <strong>or</strong>
        &nbsp;have earned a STEM degree and are now pursuing a teaching
        certification
      </span>
    );
    const title = this.iconText(isEnrolledStemCheck);
    const iconTitle = `${title} Are enrolled in a STEM undergraduate degree program, or have earned a STEM degree and are now pursuing a teaching certification`;

    return this.renderCheck(
      this.iconClass(isEnrolledStemCheck),
      iconTitle,
      title,
      isEnrolledStemText,
    );
  };

  renderChecks = () => (
    <div>
      <p className="vads-u-margin-bottom--1">
        <span className="vads-u-font-family--serif heading-level-4">
          Based on your responses, it appears you're not eligible.
        </span>
        <br />
        <br />
        <b>Your responses:</b>
      </p>
      <ul className="fa-ul vads-u-margin-left--3 vads-u-margin-top--0p5 stem-eligibility-ul">
        {this.renderIsEdithNourseRogersScholarshipCheck()}
        {this.renderExhaustionOfBenefitsCheck()}
        {this.renderIsEnrolledStemCheck()}
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

  renderDetermineEligibility = () => {
    const { showErrors, determineEligibility } = this.props;
    const id = 'root_determineEligibility';
    const divClassName = classNames(
      'form-radio-buttons',
      showErrors ? 'usa-input-error' : '',
    );
    const legendClassName = classNames(
      'schemaform-label',
      showErrors ? 'usa-input-error-label' : '',
    );
    const questionText =
      "Since it appears you're not eligible for the scholarship, would you still like to apply and let us determine your eligibility?";

    if (this.inReviewEditMode()) {
      let value;
      if (determineEligibility !== undefined) {
        value = determineEligibility ? 'Yes' : 'No';
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
        <fieldset className="schemaform-field-template schemaform-first-field">
          <legend className={legendClassName}>
            {questionText}
            <span className="schemaform-required-span">(*Required)</span>
          </legend>
          {this.renderErrorMessage()}
          <input
            type="radio"
            checked={determineEligibility != null && !determineEligibility}
            id={`${id}No`}
            name={`${id}`}
            value="N"
            onChange={() =>
              this.onChange({ 'view:determineEligibility': false })
            }
            onClick={() => captureEvents.ineligibilityStillApply(false)}
          />
          <label htmlFor={`${id}No`}>No</label>
          <input
            type="radio"
            checked={determineEligibility}
            id={`${id}Yes`}
            name={`${id}`}
            value="Y"
            onChange={() =>
              this.onChange({ 'view:determineEligibility': true })
            }
            onClick={() => {
              captureEvents.ineligibilityStillApply(true);
            }}
          />
          <label htmlFor={`${id}Yes`}>Yes</label>
        </fieldset>
      </div>
    );
  };

  renderExploreOtherBenefits = () => {
    if (this.showNotApplyingToStemInformation()) {
      const buttonClasses = classNames(
        'usa-button-primary',
        'wizard-button',
        'va-button-primary',
      );
      return (
        <div>
          <span>
            If your situation changes in the future and you meet all of the
            criteria, you may return to apply for the Rogers STEM Scholarship.
          </span>
          <div className="vads-u-padding-top--2">
            <a
              className={buttonClasses}
              href="/education/eligibility/"
              onClick={() => captureEvents.exploreOtherBenefits()}
            >
              Explore other education benefits
            </a>
          </div>
        </div>
      );
    }
    return null;
  };

  renderContinueApplication = () => {
    if (this.showNotApplyingToStemInformation()) {
      return (
        <div className="vads-u-padding-top--4">
          Since you're not applying for the Rogers STEM Scholarship, if you need
          to change your program of study or place of training, continue with
          this application.
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div>
        <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--2">
          {this.renderChecks()}
          {this.renderDetermineEligibility()}
          {this.renderExploreOtherBenefits()}
        </div>
        {this.renderContinueApplication()}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const determineEligibility = ownProps?.formData['view:determineEligibility'];
  const errors =
    ownProps?.errorSchema['view:determineEligibility']?.__errors || [];
  return {
    isEdithNourseRogersScholarship:
      state?.form?.data?.isEdithNourseRogersScholarship,
    benefit: state?.form?.data?.benefit,
    exhaustionOfBenefits: state?.form?.data['view:exhaustionOfBenefits'],
    exhaustionOfBenefitsAfterPursuingTeachingCert:
      state?.form?.data['view:exhaustionOfBenefitsAfterPursuingTeachingCert'] ||
      false,
    isEnrolledStem: state?.form?.data.isEnrolledStem,
    isPursuingTeachingCert: state?.form?.data?.isPursuingTeachingCert || false,
    determineEligibility,
    errors,
    showErrors:
      errors.length > 0 &&
      ownProps?.formContext?.submitted &&
      determineEligibility === undefined,
    reviewMode: ownProps?.formContext?.reviewMode,
    onReviewPage: ownProps?.formContext?.onReviewPage,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StemEligibilityView);
