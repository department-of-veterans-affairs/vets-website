import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import FullName from '../questions/FullName';
import Gender from '../questions/Gender';
import MothersMaidenName from './MothersMaidenName';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import State from '../questions/State';
import { maritalStatuses } from '../../utils/options-for-select.js';
import { isNotBlank } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `sectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class NameAndGeneralInfoSection extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.data.sectionComplete) {
      content = (<div>
        <p>Veteran Name: {this.props.data.fullName.first} {this.props.data.fullName.middle} {this.props.data.fullName.last} {this.props.data.fullName.suffix}</p>
        <p>Mother's Maiden Name: {this.props.data.mothersMaidenName}</p>
        <p>Social Security Number: {this.props.data.socialSecurityNumber}</p>
        <p>Gender: {this.props.data.gender}</p>
        <p>Date of Birth: {this.props.data.dateOfBirth.month}/{this.props.data.dateOfBirth.day}/{this.props.data.dateOfBirth.year}</p>
        <p>Place of Birth: {this.props.data.cityOfBirth}, {this.props.data.stateOfBirth}</p>
        <p>Current Marital Status: {this.props.data.maritalStatus}</p>
      </div>);
    } else {
      content = (<div>
        <div className="input-section">
          <FullName required
              value={this.props.data.fullName}
              onUserInput={(update) => {this.props.onStateChange('fullName', update);}}/>
          <MothersMaidenName value={this.props.data.mothersMaidenName}
              onUserInput={(update) => {this.props.onStateChange('mothersMaidenName', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.socialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('socialSecurityNumber', update);}}/>
          <Gender required
              value={this.props.data.gender}
              onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
          <DateInput required
              day={this.props.data.dateOfBirth.day}
              month={this.props.data.dateOfBirth.month}
              year={this.props.data.dateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('dateOfBirth', update);}}/>
        </div>
        <div className="input-section">
          <h4>Place of Birth</h4>
          <ErrorableTextInput label="City"
              value={this.props.data.cityOfBirth}
              onValueChange={(update) => {this.props.onStateChange('cityOfBirth', update);}}/>
          <State value={this.props.data.stateOfBirth} onUserInput={(update) => {this.props.onStateChange('stateOfBirth', update);}}/>
          <ErrorableSelect label="Current Marital Status"
              options={maritalStatuses}
              value={this.props.data.maritalStatus}
              onValueChange={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
        </div>
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
      <fieldset>
        <h4>Veteran's Name</h4>
        {editButton}
        {content}
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.nameAndGeneralInformation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['nameAndGeneralInformation', field], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(NameAndGeneralInfoSection);
export { NameAndGeneralInfoSection };
