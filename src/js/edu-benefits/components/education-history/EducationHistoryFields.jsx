import React from 'react';

import DateInput from '../../../common/components/form-elements/DateInput';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';
import ErrorableTextarea from '../../../common/components/form-elements/ErrorableTextarea';

import EducationPeriod from './EducationPeriod';
import { createEducationPeriod } from '../../utils/veteran';

import { isValidPage, isValidEducationPeriod } from '../../utils/validations';

export default class EducationHistoryFields extends React.Component {
  render() {
    const periodFields = [
      'name',
      'city',
      'state',
      'dateRange',
      'hours',
      'hoursType',
      'degreeReceived',
      'major'
    ];

    const completionDate = this.props.data.highSchoolOrGedCompletionDate;
    const { day, month, year } = completionDate;

    return (<fieldset>
      <legend className="hide-for-small-only">Education history</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <DateInput
            label="When did you earn your high school diploma or equivalency certificate?"
            name="highSchoolOrGedCompletionDate"
            day={day}
            month={month}
            year={year}
            onValueChange={(update) => {this.props.onStateChange('highSchoolOrGedCompletionDate', update);}}/>
      </div>
      <div className="input-section">
        <h4>Education after high school</h4>
        <p>Enter the name of the college or training facility where you completed educational programs after high school (including apprenticeships, on-the-job training, and flight training).</p>
        <hr/>
        <div className="input-section">
          <GrowableTable
              component={EducationPeriod}
              createRow={createEducationPeriod}
              data={this.props.data}
              initializeCurrentElement={() => this.props.initializeFields(periodFields, 'postHighSchoolTrainings')}
              onRowsUpdate={(update) => {this.props.onStateChange('postHighSchoolTrainings', update);}}
              path="/education-history/education-information"
              rows={this.props.data.postHighSchoolTrainings}
              isValidSection={isValidPage}
              isValidRow={isValidEducationPeriod}/>
        </div>
      </div>
      <hr/>
      <div className="input-section">
        <ErrorableTextarea
            label="If you have any FAA flight certificates, please list them here."
            name="faaFlightCertificatesInformation"
            field={this.props.data.faaFlightCertificatesInformation}
            onValueChange={(update) => {this.props.onStateChange('faaFlightCertificatesInformation', update);}}/>
      </div>
    </fieldset>
    );
  }
}

EducationHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
