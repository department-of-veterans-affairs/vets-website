import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

export class StemEligibilityView extends React.Component {
  onChange = property => {
    this.props.onChange({
      ...this.props.formData,
      ...property,
    });
  };

  icon = indication => (indication ? 'fa fa-check' : 'fa fa-times');

  color = indication => (indication ? 'green' : 'red');

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
      isEdithNourseRogersScholarship && benefit === 'chapter33';
    const exhaustionOfBenefitsCheck =
      exhaustionOfBenefits || exhaustionOfBenefitsAfterPursuingTeachingCert;
    const isEnrolledStemCheck = isEnrolledStem || isPursuingTeachingCert;

    return (
      <div>
        <p>
          <b>Based on you responses, it appears you're not eligible.</b>
          <br />
          <br />
          <b>Your responses:</b>
        </p>
        <ul className="fa-ul">
          <li>
            <span className="fa-li">
              <i
                className={this.icon(isEdithNourseRogersScholarshipCheck)}
                style={{
                  color: this.color(isEdithNourseRogersScholarshipCheck),
                }}
                aria-hidden="true"
              />
            </span>
            Post-9/11 GI Bill beneficiary or Fry Scholarship recipient
          </li>
          <li>
            <span className="fa-li">
              <i
                className={this.icon(exhaustionOfBenefitsCheck)}
                style={{ color: this.color(exhaustionOfBenefitsCheck) }}
                aria-hidden="true"
              />
            </span>
            Have used all your education benefits or are within 6 months of do
            so
          </li>
          <li>
            <span className="fa-li">
              <i
                className={this.icon(isEnrolledStemCheck)}
                style={{ color: this.color(isEnrolledStemCheck) }}
                aria-hidden="true"
              />
            </span>
            Are enrolled in a STEM undergraduate degree program, or have earned
            a STEM degree and are now pursuing a teaching certification
          </li>
        </ul>
      </div>
    );
  };

  renderDetermineEligibility = () => {
    const { determineEligibility } = this.props.formData;
    const id = 'determineEligibility';

    return (
      <div className="form-radio-buttons">
        <p>
          Since it appears you're not eligible for the scholarship, would you
          still like apply and let us determine your eligibility?
          <span className="schemaform-required-span">(*Required)</span>
        </p>
        <input
          type="radio"
          checked={determineEligibility != null && !determineEligibility}
          id={`${id}No`}
          name={`${id}`}
          value="N"
          onChange={() => this.onChange({ determineEligibility: false })}
        />
        <label htmlFor={`${id}No`}>No</label>
        <input
          type="radio"
          checked={determineEligibility}
          id={`${id}Yes`}
          name={`${id}`}
          value="Y"
          onChange={() => this.onChange({ determineEligibility: true })}
        />
        <label htmlFor={`${id}Yes`}>Yes</label>
      </div>
    );
  };

  render() {
    return (
      <div className="rogers-stem-eligibility">
        {this.renderChecks()}
        {this.renderDetermineEligibility()}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
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
  determineEligibility: _.get(ownProps, 'formData.determineEligibility'),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StemEligibilityView);
