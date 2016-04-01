import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { veteranUpdateField } from '../../actions';

class MedicareMedicaidSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Medicare/Medicaid</h4>
        <ErrorableCheckbox
            label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
            checked={this.props.data.sectionComplete}
            className={`edit-checkbox ${this.props.reviewSection ? '' : 'hidden'}`}
            onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>

        <div className={`input-section ${this.props.data.sectionComplete ? 'review-view' : 'edit-view'}`}>
          <ErrorableCheckbox
              label="Are you eligible for Medicaid?"
              checked={this.props.data.isMedicaidEligible}
              onValueChange={(update) => {this.props.onStateChange('isMedicaidEligible', update);}}/>
          <div>Medicaid is a United States Health program for eligible individuals and
          families with low income and resources.</div>
          <ErrorableCheckbox
              label="Are you enrolled in Medicare Part A (hospital insurance)"
              checked={this.props.data.isEnrolledMedicarePartA}
              onValueChange={(update) => {this.props.onStateChange('isEnrolledMedicarePartA', update);}}/>
          <div>Medicare is a social insurance program administered by the United
          States government, providing health insurance coverage to people aged
          65 and over, or who meet special criteria.</div>
          <DateInput label="If so, what is your Medicare Part A effective date?"
              day={this.props.data.medicarePartAEffectiveDate.day}
              month={this.props.data.medicarePartAEffectiveDate.month}
              year={this.props.data.medicarePartAEffectiveDate.year}
              onValueChange={(update) => {this.props.onStateChange('medicarePartAEffectiveDate', update);}}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.medicareMedicaid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['medicareMedicaid', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(MedicareMedicaidSection);
export { MedicareMedicaidSection };
