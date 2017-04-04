import React from 'react';
import { connect } from 'react-redux';

import ErrorableCurrentOrPastDate from '../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import { yesNo } from '../../../common/utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class MedicareMedicaidSection extends React.Component {
  render() {
    let content;
    let medicarePartADateInput;
    let medicarePartADateReview;

    if (this.props.data.isEnrolledMedicarePartA.value === 'Y') {
      medicarePartADateReview = (<tr>
        <td>If so, what is your Medicare Part A effective date?:</td>
        <td>{this.props.data.medicarePartAEffectiveDate.month.value}
        /{this.props.data.medicarePartAEffectiveDate.day.value}/
        {this.props.data.medicarePartAEffectiveDate.year.value}</td>
      </tr>);

      medicarePartADateInput = (
        <ErrorableCurrentOrPastDate required
            label="If so, what is your Medicare Part A effective date?"
            name="medicarePartAEffective"
            date={this.props.data.medicarePartAEffectiveDate}
            onValueChange={(update) => {this.props.onStateChange('medicarePartAEffectiveDate', update);}}/>);
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you eligible for Medicaid?:</td>
            <td>{`${this.props.data.isMedicaidEligible.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Are you enrolled in Medicare Part A (hospital insurance):</td>
            <td>{`${this.props.data.isEnrolledMedicarePartA.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          {medicarePartADateReview}
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <h5>Medicaid or Medicare coverage</h5>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.isMedicaidEligible, isNotBlank) ? '' : 'Please select a response'}
              label="Are you eligible for Medicaid?"
              name="isMedicaidEligible"
              options={yesNo}
              value={this.props.data.isMedicaidEligible}
              onValueChange={(update) => {this.props.onStateChange('isMedicaidEligible', update);}}/>
          <div>Medicaid is a United States health program for eligible individuals and families with low income and few resources.</div>

          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.isEnrolledMedicarePartA, isNotBlank) ? '' : 'Please select a response'}
              label="Are you enrolled in Medicare Part A (hospital insurance)?"
              name="isEnrolledMedicarePartA"
              options={yesNo}
              value={this.props.data.isEnrolledMedicarePartA}
              onValueChange={(update) => {this.props.onStateChange('isEnrolledMedicarePartA', update);}}/>
          <div>Medicare is a social insurance program administered by the United States government, providing health insurance coverage to people aged 65 and over or who meet special criteria.</div>
          {medicarePartADateInput}
        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/insurance-information/medicare'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(MedicareMedicaidSection);
export { MedicareMedicaidSection };
