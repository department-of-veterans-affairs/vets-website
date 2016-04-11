import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import { branchesServed, dischargeTypes } from '../../utils/options-for-select.js';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class ServiceInformationSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.data.sectionComplete) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Last branch of service:</td>
            <td>{this.props.data.lastServiceBranch}</td>
          </tr>
          <tr>
            <td>Last entry date:</td>
            <td>{this.props.data.lastEntryDate.month}/
        {this.props.data.lastEntryDate.day}/{this.props.data.lastEntryDate.year}</td>
          </tr>
          <tr>
            <td>Last discharge date:</td>
            <td>{this.props.data.lastDischargeDate.month}/
        {this.props.data.lastDischargeDate.day}/{this.props.data.lastDischargeDate.year}</td>
          </tr>
          <tr>
            <td>Discharge Type:</td>
            <td>{this.props.data.dischargeType}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div className="input-section">
        <ErrorableSelect
            label="Last branch of service"
            options={branchesServed}
            value={this.props.data.lastServiceBranch}
            onValueChange={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>

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
            onValueChange={(update) => {this.props.onStateChange('dischargeType', update);}}/>
      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.data.sectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.data.sectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onStateChange('sectionComplete', update);}}/>
      );
    }
    return (
      <div>
        <h4>Service Information</h4>
        {editButton}
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.serviceInformation,
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
