import PropTypes from 'prop-types';
import React from 'react';

import Address from '../../../../common/components/questions/Address';
import ErrorableTextInput from '../../../../common/components/form-elements/ErrorableTextInput';
import ErrorableSelect from '../../../../common/components/form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';
import ErrorableDate from '../../../../common/components/form-elements/ErrorableDate';

import { schoolTypes, schoolTypesWithTuitionTopUp, yesNo } from '../../utils/options-for-select';
import { showSchoolAddress } from '../../../utils/helpers';

export default class SchoolSelectionFields extends React.Component {
  render() {
    const schoolTypesList = (this.props.data.chapter33 || this.props.data.chapter30)
      ? schoolTypesWithTuitionTopUp
      : schoolTypes;

    return (<fieldset>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <p>In what type of education or training do you plan to enroll?</p>
      <ExpandingGroup
        additionalClass="edu-benefits-active-group"
        open={showSchoolAddress(this.props.data.educationType.value)}>
        <div className="input-section">
          <ErrorableSelect
            label="Type of education or training:"
            name="educationType"
            options={schoolTypesList}
            value={this.props.data.educationType}
            onValueChange={(update) => {this.props.onStateChange('educationType', update);}}/>
        </div>
        <div className="input-section">
          <div className="input-section">
            <p>Enter the name of the school you plan to attend. It’s okay if you don’t have a school picked out yet.</p>
            <ErrorableTextInput
              label="Name of school, university, or training facility:"
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
        <ErrorableDate
          label="The date your training began or will begin:"
          name="educationStartDate"
          date={this.props.data.educationStartDate}
          onValueChange={(update) => {this.props.onStateChange('educationStartDate', update);}}/>
        {this.props.data.currentlyActiveDuty.yes.value === 'Y'
          ? <ErrorableRadioButtons
            label="Are you getting, or do you expect to get any money (including, but not limited to, federal tuition assistance) from the Armed Forces or public health services for any part of your coursework or training?"
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
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
