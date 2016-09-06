import React from 'react';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import GrowableTable from '../../common/components/form-elements/GrowableTable';

import EmploymentPeriod from './EmploymentPeriod';
import { createTour } from '../utils/veteran';

import { validateIfDirty, isNotBlank, isValidYear, isValidSection } from '../utils/validations';
import { yesNo } from '../utils/options-for-select';

export default class EmploymentHistoryFields extends React.Component {
  render() {
    const tourFields = [
      'name',
      'months',
      'licenseOrRating',
      'postMilitaryJob'
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
            label="Are you receiving, or do you anticipate receiving, any money (including but not limited to federal tuition assistance) from the armed forces or public health services for the course for which you have applied to the VA for education benefits?"
            name="nonVaAssistance"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.nonVaAssistance}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.nonVaAssistance', update);}}/>
      </div>
    );

    return (<fieldset>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Have you held a license or journeyman rating to practice a profession?"
            name="currentlyActiveDuty"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.yes}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y' ? activeDutyQuestions : null}
      </div>
      <div className="input-section">
        <h4>Military Service</h4>
        <div className="usa-alert usa-alert-info">
          <p className="usa-alert-text">You must enter at least one period of service.
          Every period of service that you identify will be applied to the single, specific benefit you are applying for.
          If there are specific periods of service that you do not want applied to the benefit, please identify the period and
          the corresponding benefit program(s) to which you would like them applied.</p>
        </div>
        <hr/>
        <div className="input-section">
          <GrowableTable
              component={EmploymentPeriod}
              createRow={createTour}
              data={this.props.data}
              initializeCurrentElement={() => this.props.initializeFields(tourFields, 'toursOfDuty')}
              onRowsUpdate={(update) => {this.props.onStateChange('toursOfDuty', update);}}
              path="/military-history/military-service"
              rows={this.props.data.toursOfDuty}
              isValidSection={isValidSection}
              minimumRows={1}/>
          <ErrorableRadioButtons
              label="Were you commissioned as a result of senior ROTC?"
              name="seniorRotcComissioned"
              options={yesNo}
              value={this.props.data.seniorRotcComissioned}
              onValueChange={(update) => {this.props.onStateChange('seniorRotcComissioned', update);}}/>
            {this.props.data.seniorRotcComissioned.value === 'Y'
              ? <ErrorableTextInput
                  errorMessage={validateIfDirty(this.props.data.seniorRotcComissionYear, isValidYear) ? undefined : 'Please enter a valid year'}
                  label="Year of commission"
                  name="seniorRotcComissionYear"
                  field={this.props.data.seniorRotcComissionYear}
                  onValueChange={(update) => {this.props.onStateChange('seniorRotcComissionYear', update);}}/>
                : null}
        </div>
      </div>
    </fieldset>
    );
  }
}

EmploymentHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
