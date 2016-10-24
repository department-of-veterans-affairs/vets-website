import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableNumberInput from '../../../common/components/form-elements/ErrorableNumberInput';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';

import MilitaryServiceTour from './MilitaryServiceTour';
import { createTour } from '../../utils/veteran';

import { validateIfDirty, isValidCurrentOrPastYear, isValidPage, isValidField, isValidTourOfDuty } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class MilitaryServiceFields extends React.Component {
  render() {
    const tourFields = [
      'applyPeriodToSelected',
      'benefitsToApplyTo',
      'serviceBranch',
      'dateRange',
      'serviceStatus',
    ];
    const activeDutyQuestions = (
      <div>
        <ErrorableRadioButtons
            label="Are you currently on terminal leave?"
            name="onTerminalLeave"
            options={yesNo}
            value={this.props.data.currentlyActiveDuty.onTerminalLeave}
            onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.onTerminalLeave', update);}}/>
      </div>
    );

    return (<fieldset>
      <legend>Military service</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableNumberInput
            additionalClass="usa-input-medium"
            errorMessage={validateIfDirty(this.props.data.serviceAcademyGraduationYear, (value) => isValidField(isValidCurrentOrPastYear, { value })) ? undefined : 'Please enter a valid year (cannot be future year)'}
            label="If you received a commission from a military service academy, what year did you graduate?"
            name="serviceAcademyGraduationYear"
            min="1900"
            field={this.props.data.serviceAcademyGraduationYear}
            onValueChange={(update) => {this.props.onStateChange('serviceAcademyGraduationYear', update);}}/>
        <ExpandingGroup open={this.props.data.currentlyActiveDuty.yes.value === 'Y'} additionalClass="edu-benefits-mil-group">
          <ErrorableRadioButtons
              label="Are you currently on active duty?"
              name="currentlyActiveDuty"
              options={yesNo}
              value={this.props.data.currentlyActiveDuty.yes}
              onValueChange={(update) => {this.props.onStateChange('currentlyActiveDuty.yes', update);}}/>
          {activeDutyQuestions}
        </ExpandingGroup>
      </div>
      <div className="input-section">
        <h4>Service periods</h4>
        <p>Please record all your periods of service.</p>
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
              addNewMessage="Add Another Tour"
              minimumRows={1}
              isValidRow={isValidTourOfDuty}/>
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
