import React from 'react';
import { connect } from 'react-redux';

import ErrorableCurrentOrPastDate from '../../../common/components/form-elements/ErrorableCurrentOrPastDate';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import SocialSecurityNumber from '../../../common/components/questions/SocialSecurityNumber';
import { states } from '../../../common/utils/options-for-select.js';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class BirthInformationSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Date of birth:</td>
            <td>{this.props.data.veteranDateOfBirth.month.value}/{this.props.data.veteranDateOfBirth.day.value}/{this.props.data.veteranDateOfBirth.year.value}</td>
          </tr>
          <tr>
            <td>Social security number:</td>
            <td>{this.props.data.veteranSocialSecurityNumber.value}</td>
          </tr>
          <tr>
            <td>Place of Birth:</td>
            <td>{this.props.data.cityOfBirth.value} {this.props.data.stateOfBirth.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Birth Information</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <ErrorableCurrentOrPastDate required
              name="veteranBirth"
              date={this.props.data.veteranDateOfBirth}
              onValueChange={(update) => {this.props.onStateChange('veteranDateOfBirth', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.veteranSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('veteranSocialSecurityNumber', update);}}/>
        </div>
        <div className="input-section">
          <h4>Place of Birth</h4>
          <ErrorableTextInput label="City"
              name="cityOfBirth"
              field={this.props.data.cityOfBirth}
              autocomplete="off"
              charMax={20}
              onValueChange={(update) => {this.props.onStateChange('cityOfBirth', update);}}/>
          <ErrorableSelect label="State"
              name="stateOfBirth"
              options={states.USA_OTHER}
              autocomplete="off"
              value={this.props.data.stateOfBirth}
              onValueChange={(update) => {this.props.onStateChange('stateOfBirth', update);}}/>
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
    isSectionComplete: state.uiState.sections['/veteran-information/birth-information'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(BirthInformationSection);
export { BirthInformationSection };
