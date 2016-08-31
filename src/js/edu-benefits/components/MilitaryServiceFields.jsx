import React from 'react';

import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import GrowableTable from '../../common/components/form-elements/GrowableTable';

import MilitaryServiceTour from './MilitaryServiceTour';
import { createTour } from '../utils/veteran';

import { validateIfDirty, isNotBlank, isValidYear } from '../../common/utils/validations';
import { yesNo } from '../utils/options-for-select';

export default class MilitaryServiceFields extends React.Component {
  render() {
    const tourFields = [
      'doNotApplyPeriodToSelected',
      'applyToChapter30',
      'applyToChapter1606',
      'applyToChapter32',
      'serviceBranch',
      'dateRange.fromDate',
      'dateRange.toDate',
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
            label="Are you receiving, or do you anticipate receiving, any money (including but not limited to federal tuition assistance) from the armed forces or public health services for the course for which you have applied to the VA for education benefits?"
            name="nonVaAssistance"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.nonVaAssistance}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.nonVaAssistance', update);}}/>
      </div>
    );

    return (<fieldset>
      <legend>Military Service</legend>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <div className="input-section">
        <p>If you graduated from a military service academy, what year did you graduate?</p>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data, isValidYear) ? undefined : 'Please enter a valid year'}
            label="Year"
            name="serviceAcademyGraduationYear"
            field={this.props.data.serviceAcademyGraduationYear}
            onValueChange={(update) => {this.handleChange(update);}}/>
        <ErrorableRadioButtons
            errorMessage={validateIfDirty(this.props.data.currentlyActiveDuty.yes, isNotBlank) ? '' : 'Please select a response'}
            label="Are you on active duty?"
            name="currentlyActiveDuty"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.yes}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y' ? activeDutyQuestions : null}
      </div>
      <fieldset>
        <legend>Military Service</legend>
        <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
        <div className="usa-alert usa-alert-info">
          You must enter at least one period of service.
          Every period of service that you identify will be applied to the single, specific benefit you are applying for.
          If there are specific periods of service that you do not want applied to the benefit, please identify the period and
          the corresponding benefit program(s) to which you would like them applied.
        </div>
        <hr/>
        <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <GrowableTable
              component={MilitaryServiceTour}
              createRow={createTour}
              data={this.props.data}
              initializeCurrentElement={() => this.props.initializeFields(tourFields, 'toursOfDuty')}
              onRowsUpdate={(update) => {this.props.onStateChange('toursOfDuty', update);}}
              path="/military-history/military-service"
              rows={this.props.data.toursOfDuty}/>
        </div>
      </fieldset>
    </fieldset>
    );
  }
}

MilitaryServiceFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
