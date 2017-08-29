import PropTypes from 'prop-types';
import React from 'react';

import ErrorableRadioButtons from '../../../../common/components/form-elements/ErrorableRadioButtons';
import GrowableTable from '../../../../common/components/form-elements/GrowableTable';
import ExpandingGroup from '../../../../common/components/form-elements/ExpandingGroup';

import EmploymentPeriod from './EmploymentPeriod';
import EmploymentHistoryReview from './EmploymentHistoryReview';
import { createEmploymentPeriod } from '../../utils/veteran';

import { isValidPage, isValidEmploymentPeriod } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class EmploymentHistoryFields extends React.Component {
  constructor() {
    super();
    this.addAnotherPeriod = this.addAnotherPeriod.bind(this);
  }
  addAnotherPeriod() {
    const periods = this.props.data.nonMilitaryJobs.concat(createEmploymentPeriod());
    this.props.onStateChange('nonMilitaryJobs', periods);
  }
  render() {
    const periodFields = [
      'name',
      'months',
      'licenseOrRating',
      'postMilitaryJob'
    ];

    const periodsTable = (
      <GrowableTable
        component={EmploymentPeriod}
        alwaysShowUpdateRemoveButtons={this.props.inReview}
        showSingleRowExpanded={!this.props.inReview}
        createRowIfEmpty={!this.props.inReview}
        showEditButton={false}
        showAddAnotherButton={!this.props.inReview}
        createRow={createEmploymentPeriod}
        data={this.props.data}
        initializeCurrentElement={() => this.props.initializeFields(periodFields, 'nonMilitaryJobs')}
        onRowsUpdate={(update) => {this.props.onStateChange('nonMilitaryJobs', update);}}
        path="/employment-history/employment-information"
        rows={this.props.data.nonMilitaryJobs}
        isValidSection={isValidPage}
        isValidRow={isValidEmploymentPeriod}/>
    );

    const formView = (<fieldset className="edu-growable-form">
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ExpandingGroup open={this.props.data.hasNonMilitaryJobs.value === 'Y'} additionalClass="edu-benefits-employ-group">
          <div className="input-section">
            <ErrorableRadioButtons
              label="Have you ever held a license or a journeyman rating (for example, as a contractor or plumber) to practice a profession?"
              name="hasNonMilitaryJobs"
              options={yesNo}
              value={this.props.data.hasNonMilitaryJobs}
              onValueChange={(update) => {this.props.onStateChange('hasNonMilitaryJobs', update);}}/>
          </div>
          <div className="input-section">
            <h4>Employment</h4>
            <div className="input-section">
              {periodsTable}
            </div>
          </div>
        </ExpandingGroup>
      </div>
      {this.props.inReview && <button className="usa-button-primary" onClick={this.props.onSave}>Update</button>}
    </fieldset>
    );

    const editView = (<fieldset>
      <legend className="hide-for-small-only">Employment history</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableRadioButtons
          label="Have you ever held a license or a journeyman rating (for example, as a contractor or plumber) to practice a profession?"
          name="hasNonMilitaryJobs"
          options={yesNo}
          value={this.props.data.hasNonMilitaryJobs}
          onValueChange={(update) => {this.props.onStateChange('hasNonMilitaryJobs', update);}}/>
      </div>
      <button className="usa-button-primary" onClick={this.props.onSave}>Update</button>
    </fieldset>);

    const reviewView = (<div>
      <div className="form-review-panel-page">
        {this.props.editing
          ? editView
          : <EmploymentHistoryReview data={this.props.data} onEdit={this.props.onEdit}/>}
      </div>
      {this.props.data.hasNonMilitaryJobs.value === 'Y' &&
        <div className="form-review-panel-page">
          <div className="form-review-panel-page-header-row header-stacked-small edu-growable-review-header">
            <h5 className="form-review-panel-page-header">Employment</h5>
            <button
              className="edit-btn primary-outline"
              onClick={this.addAnotherPeriod}>Add Another</button>
          </div>
          {periodsTable}
        </div>}
    </div>);

    return this.props.inReview ? reviewView : formView;
  }
}

EmploymentHistoryFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
