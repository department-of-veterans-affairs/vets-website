import React from 'react';

import DateInput from '../../../common/components/form-elements/DateInput';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';

import EducationPeriod from './EducationPeriod';
import FlightCertificate from './FlightCertificate';
import { createEducationPeriod, createFlightCertificate } from '../../utils/veteran';

import { isValidPage } from '../../utils/validations';

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
    const certificateFields = [
      'name'
    ];

    const completionDate = this.props.data.highSchoolOrGedCompletionDate;
    const { day, month, year } = completionDate;

    return (<fieldset>
      <legend className="hide-for-small-only">Education history</legend>
      <div className="input-section">
        <DateInput
            label="If you received a high school diploma or high school equivalency certificate, what date was it received? (month, day, year)"
            name="highSchoolOrGedCompletionDate"
            day={day}
            month={month}
            year={year}
            onValueChange={(update) => {this.props.onStateChange('highSchoolOrGedCompletionDate', update);}}/>
      </div>
      <div className="input-section">
        <p>Education after High School (Including apprenticeship, on-the-job training, and flight training)</p>
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
      <hr/>
      <div className="input-section">
        <p>FAA certificates</p>
        <GrowableTable
            component={FlightCertificate}
            createRow={createFlightCertificate}
            data={this.props.data}
            initializeCurrentElement={() => this.props.initializeFields(certificateFields, 'faaFlightCertificatesInformation')}
            onRowsUpdate={(update) => {this.props.onStateChange('faaFlightCertificatesInformation', update);}}
            path="/education-history/education-information"
            rows={this.props.data.faaFlightCertificatesInformation}
            isValidSection={isValidPage}/>
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
