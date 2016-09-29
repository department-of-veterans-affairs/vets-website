import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableNumberInput from '../../../common/components/form-elements/ErrorableNumberInput';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';

import MilitaryServiceTour from './MilitaryServiceTour';
import { createTour } from '../../utils/veteran';

import { validateIfDirty, isNotBlank, isValidYear, isValidPage, isValidField } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class MilitaryServiceFields extends React.Component {
  render() {
    const tourFields = [
      'doNotApplyPeriodToSelected',
      'benefitsToApplyTo',
      'serviceBranch',
      'dateRange',
      'serviceStatus',
      'involuntarilyCalledToDuty'
    ];
    const activeDutyQuestions = (
      <div>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.onTerminalLeave, isNotBlank) ? '' : 'Please select a response'}
            label="Are you on terminal leave?"
            name="onTerminalLeave"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.onTerminalLeave}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.onTerminalLeave', update);}}/>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.nonVaAssistance, isNotBlank) ? '' : 'Please select a response'}
            label="Are you receiving, or do you expect to receive any money (including, but not limited to, federal tuition assistance) from the armed forces or public health services for any part of your coursework?"
            name="nonVaAssistance"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.nonVaAssistance}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.nonVaAssistance', update);}}/>
      </div>
    );

    return (<fieldset>
      <legend>Military service</legend>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <div className="input-section">
        <p>If you graduated from a military service academy, what year did you graduate?</p>
        <ErrorableNumberInput
            errorMessage={validateIfDirty(this.props.data.serviceAcademyGraduationYear, (value) => isValidField(isValidYear, { value })) ? undefined : 'Please enter a valid year'}
            label="Year"
            placeholder="yyyy"
            name="serviceAcademyGraduationYear"
            min="1900"
            field={this.props.data.serviceAcademyGraduationYear}
            onValueChange={(update) => {this.props.onStateChange('serviceAcademyGraduationYear', update);}}/>
        <ErrorableRadioButtons
            label="Are you on active duty?"
            name="currentlyActiveDuty"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.yes}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y' ? activeDutyQuestions : null}
      </div>
      <div className="input-section">
        <h4>Military Service</h4>
        <hr/>
        <div className="input-section">
          <GrowableTable
              component={MilitaryServiceTour}
              createRow={createTour}
              data={this.props.data}
              initializeCurrentElement={() => this.props.initializeFields(tourFields, 'toursOfDuty')}
              onRowsUpdate={(update) => {this.props.onStateChange('toursOfDuty', update);}}
              path="/military-history/military-service"
              rows={this.props.data.toursOfDuty}
              isValidSection={isValidPage}
              minimumRows={1}/>
          <ErrorableRadioButtons
              label="Were you commissioned as a result of senior ROTC?"
              name="seniorRotcCommissioned"
              options={yesNo}
              value={this.props.data.seniorRotcCommissioned}
              onValueChange={(update) => {this.props.onStateChange('seniorRotcCommissioned', update);}}/>
        </div>
      </div>
    </fieldset>
    );
  }
}

MilitaryServiceFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
