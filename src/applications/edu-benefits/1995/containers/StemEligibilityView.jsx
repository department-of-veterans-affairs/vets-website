import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isChapter33 } from '../helpers';

export class StemEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({
      ...this.props.formData,
      ...property,
    });
  };

  iconClass = indication =>
    classNames('fa', {
      'fa-check': indication,
      'vads-u-color--green': indication,
      'fa-times': !indication,
      'vads-u-color--gray-medium': !indication,
    });

  renderChecks = () => {
    const {
      isEdithNourseRogersScholarship,
      benefit,
      exhaustionOfBenefits,
      exhaustionOfBenefitsAfterPursuingTeachingCert,
      isEnrolledStem,
      isPursuingTeachingCert,
    } = this.props;

    const isEdithNourseRogersScholarshipCheck =
      isEdithNourseRogersScholarship && isChapter33({ benefit });
    const isEdithNourseRogersScholarshipQuestion =
      isEdithNourseRogersScholarship && benefit === undefined;
    const exhaustionOfBenefitsCheck =
      exhaustionOfBenefits || exhaustionOfBenefitsAfterPursuingTeachingCert;
    const isEnrolledStemCheck = isEnrolledStem || isPursuingTeachingCert;

    const isEdithNourseRogersScholarshipClasses = isEdithNourseRogersScholarshipQuestion
      ? 'fa fa-question vads-u-color--gray-medium'
      : this.iconClass(isEdithNourseRogersScholarshipCheck);

    return (
      <div>
        <p className="vads-u-margin-bottom--1">
          <span className="vads-u-font-family--serif heading-level-4">
            Based on you responses, it appears you're not eligible.
          </span>
          <br />
          <br />
          <b>Your responses:</b>
        </p>
        <ul className="fa-ul vads-u-margin-left--3 vads-u-margin-top--0p5 stem-eligibility-ul">
          <li className="vads-u-margin-bottom--0">
            <span className="fa-li">
              <i
                className={isEdithNourseRogersScholarshipClasses}
                aria-hidden="true"
              />
            </span>
            Post-9/11 GI Bill beneficiary or Fry Scholarship recipient
          </li>
          <li className="vads-u-margin-bottom--0">
            <span className="fa-li">
              <i
                className={this.iconClass(exhaustionOfBenefitsCheck)}
                aria-hidden="true"
              />
            </span>
            Have used all your education benefits or are within 6 months of
            doing so
          </li>
          <li className="vads-u-margin-bottom--0">
            <span className="fa-li">
              <i
                className={this.iconClass(isEnrolledStemCheck)}
                aria-hidden="true"
              />
            </span>
            Are enrolled in a STEM undergraduate degree program,{' '}
            <strong>or</strong> have earned a STEM degree and are now pursuing a
            teaching certification
          </li>
        </ul>
      </div>
    );
  };

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
    return (
      <div className={divClassName}>
        <legend className={legendClassName}>
          Since it appears you're not eligible for the scholarship, would you
          still like to apply and let us determine your eligibility?
          <span className="schemaform-required-span">(*Required)</span>
        </legend>
        {this.renderErrorMessage()}
        <input
          type="radio"
          checked={determineEligibility != null && !determineEligibility}
          id={`${id}No`}
          name={`${id}`}
          value="N"
          onChange={() => this.onChange({ 'view:determineEligibility': false })}
        />
        <label htmlFor={`${id}No`}>No</label>
        <input
          type="radio"
          checked={determineEligibility}
          id={`${id}Yes`}
          name={`${id}`}
          value="Y"
          onChange={() => this.onChange({ 'view:determineEligibility': true })}
        />
        <label htmlFor={`${id}Yes`}>Yes</label>
      </div>
    );
  };

  renderExploreOtherBenefits = () => {
    const { determineEligibility } = this.props;
    if (determineEligibility !== undefined && !determineEligibility) {
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
            <a className={buttonClasses} href="/education/eligibility/">
              Explore other education benefits
            </a>
          </div>
        </div>
      );
    }
    return null;
  };

  renderContinueApplication = () => {
    const { determineEligibility } = this.props;
    if (determineEligibility !== undefined && !determineEligibility) {
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
  const determineEligibility = _.get(
    ownProps,
    'formData.view:determineEligibility',
  );
  const errors = _.get(
    ownProps,
    'errorSchema.view:determineEligibility.__errors',
    [],
  );
  return {
    isEdithNourseRogersScholarship: _.get(
      state,
      'form.data.isEdithNourseRogersScholarship',
    ),
    benefit: _.get(state, 'form.data.benefit'),
    exhaustionOfBenefits: _.get(state, 'form.data.view:exhaustionOfBenefits'),
    exhaustionOfBenefitsAfterPursuingTeachingCert: _.get(
      state,
      'form.data.view:exhaustionOfBenefitsAfterPursuingTeachingCert',
      false,
    ),
    isEnrolledStem: _.get(state, 'form.data.isEnrolledStem'),
    isPursuingTeachingCert: _.get(
      state,
      'form.data.isPursuingTeachingCert',
      false,
    ),
    determineEligibility,
    errors,
    showErrors:
      errors.length > 0 &&
      _.get(ownProps, 'formContext.submitted') &&
      determineEligibility === undefined,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StemEligibilityView);
