import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { branchesServed, dischargeTypes } from '../../utils/options-for-select.js';
import { veteranUpdateField } from '../../actions';

class ServiceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Service Information</h4>
        <ErrorableCheckbox
            label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
            checked={this.props.data.sectionComplete}
            className={`edit-checkbox ${this.props.reviewSection ? '' : 'hidden'}`}
            onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>

        <div className={`input-section ${this.props.data.sectionComplete ? 'review-view' : 'edit-view'}`}>
          <ErrorableSelect
              label="Last branch of service"
              options={branchesServed}
              value={this.props.data.lastServiceBranch}
              onUserInput={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>

          <DateInput label="Last entry date"
              day={this.props.data.lastEntryDate.day}
              month={this.props.data.lastEntryDate.month}
              year={this.props.data.lastEntryDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastEntryDate', update);}}/>

          <DateInput label="Last discharge date"
              day={this.props.data.lastDischargeDate.day}
              month={this.props.data.lastDischargeDate.month}
              year={this.props.data.lastDischargeDate.year}
              onValueChange={(update) => {this.props.onStateChange('lastDischargeDate', update);}}/>

          <ErrorableSelect
              label="Discharge Type"
              options={dischargeTypes}
              value={this.props.data.dischargeType}
              onUserInput={(update) => {this.props.onStateChange('dischargeType', update);}}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.serviceInformation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['serviceInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ServiceInformationSection);
export { ServiceInformationSection };
