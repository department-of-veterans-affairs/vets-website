import React from 'react';

import DateInput from '../../common/components/form-elements/DateInput';
import GrowableTable from '../../common/components/form-elements/GrowableTable';

import EducationPeriod from './EducationPeriod';
import { createEducationPeriod } from '../utils/veteran';

import { isValidPage, isValidDate } from '../utils/validations';

export default class EducationHistoryFields extends React.Component {
  render() {
    const periodFields = [
      'name',
      'city',
      'state',
      'dateRange',
      'hours',
      'hoursType',
      'degreeRecieved',
      'major'
    ];

    const completionDate = this.props.data.highSchoolOrGedCompletionDate;
    const { day, month, year } = completionDate;

    return (<fieldset>
      <div className="input-section">
        <DateInput
            label="If you received a high school diploma or high school equivalency certificate, what date was it received? (month, day, year)"
            name="highSchoolOrGedCompletionDate"
            day={day}
            month={month}
            year={year}
            onValueChange={(update) => {this.props.onStateChange('highSchoolOrGedCompletionDate', update);}}/>
      </div>
      {isValidDate(day.value, month.value, year.value)
        ? <div className="input-section">
          <h4>Education after High School (Including apprenticeship, on-the-job training, and flight training)</h4>
          <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
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
                isValidSection={isValidPage}/>
          </div>
        </div>
      : null}
    </fieldset>
    );
  }
}

EducationHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
