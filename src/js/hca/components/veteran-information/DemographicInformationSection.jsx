import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import Gender from '../questions/Gender';
import { maritalStatuses } from '../../utils/options-for-select.js';
import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class DemographicInformationSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Gender:</td>
              <td>{this.props.data.gender.value}</td>
            </tr>
            <tr>
              <td>Martial Status:</td>
              <td>{this.props.data.maritalStatus.value}</td>
            </tr>
          </tbody>
        </table>
        <h4>Which categories best describe you?</h4>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>American Indian or Alaksan Native:</td>
              <td>{`${this.props.data.isAmericanIndianOrAlaskanNative ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Black or African American:</td>
              <td>{`${this.props.data.isBlackOrAfricanAmerican ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Native Hawaiian or Other Pacific Islander:</td>
              <td>{`${this.props.data.isNativeHawaiianOrOtherPacificIslander ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Asian:</td>
              <td>{`${this.props.data.isAsian ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>White:</td>
              <td>{`${this.props.data.isWhite ? 'Yes' : ''}`}</td>
            </tr>
            <tr>
              <td>Spanish, Hispanic, or Latino:</td>
              <td>{`${this.props.data.isSpanishHispanicLatino ? 'Yes' : ''}`}</td>
            </tr>
          </tbody>
        </table>
      </div>);
    } else {
      content = (<fieldset>
        <legend>Demographic Information</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <Gender required
              value={this.props.data.gender}
              onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>

          <ErrorableSelect required
              errorMessage={validateIfDirty(this.props.data.maritalStatus, isNotBlank) ? undefined : 'Please select a marital status'}
              label="Current marital status"
              name="maritalStatus"
              options={maritalStatuses}
              value={this.props.data.maritalStatus}
              onValueChange={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
        </div>

        <div className="input-section">
          <h4>Which categories best describe you?</h4>
          <span className="usa-form-hint">You may check more than one.</span>
          <ErrorableCheckbox
              label="American Indian or Alaskan Native"
              name="isAmericanIndianOrAlaskanNative"
              checked={this.props.data.isAmericanIndianOrAlaskanNative}
              onValueChange={(update) => {this.props.onStateChange('isAmericanIndianOrAlaskanNative', update);}}/>

          <ErrorableCheckbox
              label="Black or African American"
              name="isBlackOrAfricanAmerican"
              checked={this.props.data.isBlackOrAfricanAmerican}
              onValueChange={(update) => {this.props.onStateChange('isBlackOrAfricanAmerican', update);}}/>

          <ErrorableCheckbox
              label="Native Hawaiian or Other Pacific Islander"
              name="isNativeHawaiianOrOtherPacificIslander"
              checked={this.props.data.isNativeHawaiianOrOtherPacificIslander}
              onValueChange={(update) => {this.props.onStateChange('isNativeHawaiianOrOtherPacificIslander', update);}}/>

          <ErrorableCheckbox
              label="Asian"
              name="isAsian"
              checked={this.props.data.isAsian}
              onValueChange={(update) => {this.props.onStateChange('isAsian', update);}}/>

          <ErrorableCheckbox
              label="White"
              name="isWhite"
              checked={this.props.data.isWhite}
              onValueChange={(update) => {this.props.onStateChange('isWhite', update);}}/>

          <ErrorableCheckbox
              label="Spanish, Hispanic, or Latino"
              name="isSpanishHispanicLatino"
              checked={this.props.data.isSpanishHispanicLatino}
              onValueChange={(update) => {this.props.onStateChange('isSpanishHispanicLatino', update);}}/>
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
    isSectionComplete: state.uiState.sections['/veteran-information/demographic-information'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(DemographicInformationSection);
export { DemographicInformationSection };
