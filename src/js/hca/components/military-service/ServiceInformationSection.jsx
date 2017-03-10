import React from 'react';
import { connect } from 'react-redux';

import ErrorableCurrentOrPastDate from '../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import { branchesServed, dischargeTypes } from '../../../common/utils/options-for-select.js';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { isValidDischargeDateField, isValidEntryDateField } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';
import { displayLabel } from '../../store/calculated';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class ServiceInformationSection extends React.Component {

  render() {
    let content;

    const selectedLastServiceBranch = this.props.data.lastServiceBranch.value;
    const selectedDischargeType = this.props.data.dischargeType.value;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Last branch of service:</td>
            <td>{displayLabel(branchesServed, selectedLastServiceBranch)}</td>
          </tr>
          <tr>
            <td>Last entry date:</td>
            <td>{this.props.data.lastEntryDate.month.value}/
        {this.props.data.lastEntryDate.day.value}/{this.props.data.lastEntryDate.year.value}</td>
          </tr>
          <tr>
            <td>Last discharge date:</td>
            <td>{this.props.data.lastDischargeDate.month.value}/
        {this.props.data.lastDischargeDate.day.value}/{this.props.data.lastDischargeDate.year.value}</td>
          </tr>
          <tr>
            <td>Discharge Type:</td>
            <td>{displayLabel(dischargeTypes, selectedDischargeType)}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <h5>Service Periods</h5>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableSelect required
              errorMessage={validateIfDirty(this.props.data.lastServiceBranch, isNotBlank) ? undefined : 'Please select a service branch'}
              label="Last branch of service"
              name="lastServiceBranch"
              options={branchesServed}
              value={this.props.data.lastServiceBranch}
              onValueChange={(update) => {this.props.onStateChange('lastServiceBranch', update);}}/>

          <ErrorableCurrentOrPastDate required
              validation={{
                valid: isValidEntryDateField(this.props.data.lastEntryDate, this.props.data.veteranDateOfBirth),
                message: 'You must have been at least 15 years old when you entered the service'
              }}
              label="Start of service period"
              name="lastEntry"
              date={this.props.data.lastEntryDate}
              onValueChange={(update) => {this.props.onStateChange('lastEntryDate', update);}}/>

          <ErrorableCurrentOrPastDate required
              validation={{
                valid: isValidDischargeDateField(this.props.data.lastDischargeDate, this.props.data.lastEntryDate),
                message: 'Discharge date must be after start of service period date and before today'
              }}
              label="Date of discharge"
              name="lastDischarge"
              date={this.props.data.lastDischargeDate}
              onValueChange={(update) => {this.props.onStateChange('lastDischargeDate', update);}}/>

          <ErrorableSelect required
              errorMessage={validateIfDirty(this.props.data.dischargeType, isNotBlank) ? undefined : 'Please select a discharge type'}
              label="Character of discharge"
              name="dischargeType"
              options={dischargeTypes}
              value={this.props.data.dischargeType}
              onValueChange={(update) => {this.props.onStateChange('dischargeType', update);}}/>
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
    isSectionComplete: state.uiState.sections['/military-service/service-information'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ServiceInformationSection);
export { ServiceInformationSection };
