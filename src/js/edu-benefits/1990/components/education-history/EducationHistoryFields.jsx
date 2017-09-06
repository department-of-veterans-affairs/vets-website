import PropTypes from 'prop-types';
import React from 'react';

import ErrorableMonthYear from '../../../../common/components/form-elements/ErrorableMonthYear';
import GrowableTable from '../../../../common/components/form-elements/GrowableTable';
import ErrorableTextarea from '../../../../common/components/form-elements/ErrorableTextarea';

import EducationPeriod from './EducationPeriod';
import EducationHistoryReview from './EducationHistoryReview';
import { createEducationPeriod } from '../../utils/veteran';

import { isValidPage, isValidEducationPeriod } from '../../utils/validations';
import { isValidPartialMonthYearInPast } from '../../../../common/utils/validations';

export default class EducationHistoryFields extends React.Component {
  constructor() {
    super();
    this.addAnotherPeriod = this.addAnotherPeriod.bind(this);
  }
  addAnotherPeriod() {
    const periods = this.props.data.postHighSchoolTrainings.concat(createEducationPeriod());
    this.props.onStateChange('postHighSchoolTrainings', periods);
  }
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

    const periodsTable = (
      <GrowableTable
        component={EducationPeriod}
        alwaysShowUpdateRemoveButtons={this.props.inReview}
        showSingleRowExpanded={!this.props.inReview}
        createRowIfEmpty={!this.props.inReview}
        showEditButton={false}
        showAddAnotherButton={!this.props.inReview}
        createRow={createEducationPeriod}
        data={this.props.data}
        initializeCurrentElement={() => this.props.initializeFields(periodFields, 'postHighSchoolTrainings')}
        onRowsUpdate={(update) => {this.props.onStateChange('postHighSchoolTrainings', update);}}
        path="/education-history/education-information"
        rows={this.props.data.postHighSchoolTrainings}
        isValidSection={isValidPage}
        isValidRow={isValidEducationPeriod}/>
    );

    const formView = (<fieldset className={this.props.inReview ? null : 'edu-growable-form'}>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableMonthYear
          validation={{
            valid: isValidPartialMonthYearInPast(completionDate.month.value, completionDate.year.value),
            message: 'Please provide a valid date in the past'
          }}
          label="When did you earn your high school diploma or equivalency certificate?"
          name="highSchoolOrGedCompletionDate"
          date={completionDate}
          onValueChange={(update) => {this.props.onStateChange('highSchoolOrGedCompletionDate', update);}}/>
      </div>
      {!this.props.inReview && <div className="input-section">
        <h4>Education after high school</h4>
        <p>Enter the name of the college or training facility where you completed educational programs after high school (including apprenticeships, on-the-job training, and flight training).</p>
        <hr/>
        <div className="input-section">
          {periodsTable}
        </div>
      </div>}
      {!this.props.inReview && <hr/>}
      <div className="input-section">
        <ErrorableTextarea
          label="If you have any FAA flight certificates, please list them here."
          name="faaFlightCertificatesInformation"
          field={this.props.data.faaFlightCertificatesInformation}
          onValueChange={(update) => {this.props.onStateChange('faaFlightCertificatesInformation', update);}}/>
      </div>
      {this.props.inReview && <button className="usa-button-primary" onClick={this.props.onSave}>Update</button>}
    </fieldset>
    );

    const reviewView = (<div>
      <div className="form-review-panel-page">
        {this.props.editing
          ? formView
          : <EducationHistoryReview data={this.props.data} onEdit={this.props.onEdit}/>}
      </div>
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row header-stacked-small edu-growable-review-header">
          <h5 className="form-review-panel-page-header">Education after high school</h5>
          <button
            className="edit-btn primary-outline"
            onClick={this.addAnotherPeriod}>Add Another</button>
        </div>
        {periodsTable}
      </div>
    </div>);

    return this.props.inReview ? reviewView : formView;
  }
}

EducationHistoryFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
