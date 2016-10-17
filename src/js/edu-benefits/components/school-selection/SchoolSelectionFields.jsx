import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import DateInput from '../../../common/components/form-elements/DateInput';
import Address from '../Address';

import { validateIfDirtyDateObj, isValidFutureOrPastDateField } from '../../utils/validations';
import { schoolTypes, yesNo } from '../../utils/options-for-select';
import { showSchoolAddress } from '../../utils/helpers';

export default class SchoolSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <legend className="hide-for-small-only">School selection</legend>
      <p>In what type of education or training do you plan to enroll?</p>
      <ExpandingGroup
          additionalClass="edu-benefits-active-group"
          open={showSchoolAddress(this.props.data.educationType.value)}>
        <div className="input-section">
          <ErrorableSelect
              label="Type of education or training"
              name="educationType"
              options={schoolTypes}
              value={this.props.data.educationType}
              onValueChange={(update) => {this.props.onStateChange('educationType', update);}}/>
        </div>
        <div className="input-section">
          <div className="input-section">
            <p>Enter the name of the school you plan to attend. It's okay if you don't have a school picked out yet.</p>
            <ErrorableTextInput
                label="Name of school, university, or training facility"
                name="schoolName"
                field={this.props.data.school.name}
                onValueChange={(update) => {this.props.onStateChange('school.name', update);}}/>
          </div>
          <div className="input-section">
            <h4>Address</h4>
            <Address
                value={this.props.data.school.address}
                onUserInput={(update) => {this.props.onStateChange('school.address', update);}}/>
          </div>
        </div>
      </ExpandingGroup>
      <div className="input-section">
        <ErrorableTextInput
            label="Education or career goal (for example, “Get a bachelor’s degree in criminal justice” or “Get an HVAC technician certificate” or “Become a police officer.”)"
            name="educationObjective"
            field={this.props.data.educationObjective}
            onValueChange={(update) => {this.props.onStateChange('educationObjective', update);}}/>
        <DateInput
            errorMessage={isValidFutureOrPastDateField(this.props.data.educationStartDate) ? undefined : 'Please enter a valid date'}
            validation={validateIfDirtyDateObj(this.props.data.educationStartDate, isValidFutureOrPastDateField)}
            allowFutureDates
            label="Enter the date your training began or will begin."
            name="educationStartDate"
            day={this.props.data.educationStartDate.day}
            month={this.props.data.educationStartDate.month}
            year={this.props.data.educationStartDate.year}
            onValueChange={(update) => {this.props.onStateChange('educationStartDate', update);}}/>
        {this.props.data.currentlyActiveDuty.yes.value === 'Y'
          ? <ErrorableRadioButtons
              label="Are you receiving, or do you expect to receive any money (including, but not limited to, federal tuition assistance) from the armed forces or public health services for any part of your coursework or training?"
              name="nonVaAssistance"
              options={yesNo}
              value={this.props.data.currentlyActiveDuty.nonVaAssistance}
              onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.nonVaAssistance', update);}}/>
          : null}
      </div>
    </fieldset>
    );
  }
}

SchoolSelectionFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
