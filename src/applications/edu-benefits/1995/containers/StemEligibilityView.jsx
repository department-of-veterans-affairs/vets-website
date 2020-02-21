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

  icon = indication => (indication ? 'fa fa-check' : 'fa fa-times');

  iconColor = indication =>
    indication ? 'vads-u-color--green' : 'vads-u-color--gray-medium';

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

    const recipientIcon = isEdithNourseRogersScholarshipQuestion
      ? 'fa fa-question'
      : this.icon(isEdithNourseRogersScholarshipCheck);

    const isEdithNourseRogersScholarshipClasses = classNames(
      recipientIcon,
      this.iconColor(isEdithNourseRogersScholarshipCheck),
    );
    const exhaustionOfBenefitsClasses = classNames(
      this.icon(exhaustionOfBenefitsCheck),
      this.iconColor(exhaustionOfBenefitsCheck),
    );
    const isEnrolledStemClasses = classNames(
      this.icon(isEnrolledStemCheck),
      this.iconColor(isEnrolledStemCheck),
    );

    return (
      <div>
        <p>
          <span className="vads-u-font-family--serif heading-level-4">
            Based on you responses, it appears you're not eligible.
          </span>
          <br />
          <br />
          <b>Your responses:</b>
        </p>
        <ul className="fa-ul stem-eligibility-ul">
          <li>
            <span className="fa-li">
              <i
                className={isEdithNourseRogersScholarshipClasses}
                aria-hidden="true"
              />
            </span>
            Post-9/11 GI Bill beneficiary or Fry Scholarship recipient
          </li>
          <li>
            <span className="fa-li">
              <i className={exhaustionOfBenefitsClasses} aria-hidden="true" />
            </span>
            Have used all your education benefits or are within 6 months of
            doing so
          </li>
          <li>
            <span className="fa-li">
              <i className={isEnrolledStemClasses} aria-hidden="true" />
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
          <div className="explore-other-benefits-button">
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
        <div className="stem-eligibility-continue-application">
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
        <div className="stem-eligibility">
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
