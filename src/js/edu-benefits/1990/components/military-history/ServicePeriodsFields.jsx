import PropTypes from 'prop-types';
import React from 'react';

import GrowableTable from '../../../../common/components/form-elements/GrowableTable';

import MilitaryServiceTour from './MilitaryServiceTour';
import { createTour } from '../../utils/veteran';

import { isValidPage, isValidTourOfDuty } from '../../utils/validations';

export default class ServicePeriodsFields extends React.Component {
  constructor() {
    super();
    this.addAnotherTour = this.addAnotherTour.bind(this);
  }
  addAnotherTour() {
    const tours = this.props.data.toursOfDuty.concat(createTour());
    this.props.onStateChange('toursOfDuty', tours);
  }
  render() {
    const tourFields = [
      'applyPeriodToSelected',
      'benefitsToApplyTo',
      'serviceBranch',
      'dateRange',
      'serviceStatus',
    ];

    const toursTable = (
      <GrowableTable
        component={MilitaryServiceTour}
        alwaysShowUpdateRemoveButtons={this.props.inReview}
        showSingleRowExpanded={!this.props.inReview}
        createRowIfEmpty={!this.props.inReview}
        showEditButton={false}
        showAddAnotherButton={!this.props.inReview}
        createRow={createTour}
        data={this.props.data}
        initializeCurrentElement={() => this.props.initializeFields(tourFields, 'toursOfDuty')}
        onRowsUpdate={(update) => {this.props.onStateChange('toursOfDuty', update);}}
        path="/military-history/service-periods"
        rows={this.props.data.toursOfDuty}
        isValidSection={isValidPage}
        addNewMessage="Add Another Service Period"
        minimumRows={1}
        collapseRows={this.props.inReview ? true : undefined}
        rowTitle="New service period"
        isValidRow={isValidTourOfDuty}/>
    );

    const editView = (<fieldset className={this.props.inReview ? 'edu-growable-review' : 'edu-growable-form'}>
      <legend>Service periods</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <p>Please record all your periods of service.</p>
        <div className="input-section">
          {toursTable}
        </div>
      </div>
    </fieldset>
    );

    const reviewView = (<div>
      <div className="form-review-panel-page-header-row header-stacked-small edu-growable-review-header">
        <h5 className="form-review-panel-page-header">Service periods</h5>
        <button
          className="edit-btn primary-outline"
          onClick={this.addAnotherTour}>Add Another Service Period</button>
      </div>
      {toursTable}
    </div>);

    return !this.props.inReview || this.props.editing ? editView : reviewView;
  }
}

ServicePeriodsFields.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initializeFields: PropTypes.func.isRequired
};
