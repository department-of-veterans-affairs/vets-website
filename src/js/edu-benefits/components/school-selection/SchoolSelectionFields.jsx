import React from 'react';

import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableSelect from '../../../common/components/form-elements/ErrorableSelect';
import DateInput from '../../../common/components/form-elements/DateInput';
import Address from '../../../common/components/questions/Address';

import { validateIfDirtyDateObj, isValidFutureOrPastDateField } from '../../utils/validations';
import { schoolTypes } from '../../utils/options-for-select';
import { showSchoolAddress } from '../../utils/helpers';

export default class SchoolSelectionFields extends React.Component {
  render() {
    return (<fieldset>
      <legend className="hide-for-small-only">School selection</legend>
      <p>In what type of education or training do you plan to enroll?</p>
      <div className="input-section">
        <ErrorableSelect
            label="Type of education or training"
            name="educationType"
            options={schoolTypes}
            value={this.props.data.educationType}
            onValueChange={(update) => {this.props.onStateChange('educationType', update);}}/>
      </div>
      <div className="input-section">
          {showSchoolAddress(this.props.data.educationType.value)
          ? <div>
            <div className="input-section">
              <p>Enter the name of the school you are attending if you already know. It’s okay if you don’t have a school picked out yet.</p>
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
        : null}
        <ErrorableTextarea
            label="Education or career goal (for example, ‘Get a degree in journalism’ or ‘Become a computer programmer.’)"
            name="educationObjective"
            field={this.props.data.educationObjective}
            onValueChange={(update) => {this.props.onStateChange('educationObjective', update);}}/>
        <DateInput
            errorMessage={isValidFutureOrPastDateField(this.props.data.educationStartDate) ? undefined : 'Please enter a valid date'}
            validation={validateIfDirtyDateObj(this.props.data.educationStartDate, isValidFutureOrPastDateField)}
            label="Do you know when your training will begin?"
            name="educationStartDate"
            day={this.props.data.educationStartDate.day}
            month={this.props.data.educationStartDate.month}
            year={this.props.data.educationStartDate.year}
            onValueChange={(update) => {this.props.onStateChange('educationStartDate', update);}}/>
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
