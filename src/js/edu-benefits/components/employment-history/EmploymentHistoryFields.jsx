import React from 'react';

import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';

import EmploymentPeriod from './EmploymentPeriod';
import { createEmploymentPeriod } from '../../utils/veteran';

import { isValidPage } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class EmploymentHistoryFields extends React.Component {
  render() {
    const periodFields = [
      'name',
      'months',
      'licenseOrRating',
      'postMilitaryJob'
    ];

    return (<fieldset>
      <legend className="hide-for-small-only">Employment history</legend>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Have you ever held a license (for example, as a contractor or plumber) or a journeyman rating to practice a profession?"
            name="hasNonMilitaryJobs"
            options={yesNo}
            value={this.props.data.hasNonMilitaryJobs}
            onValueChange={(update) => {this.props.onStateChange('hasNonMilitaryJobs', update);}}/>
      </div>
      {this.props.data.hasNonMilitaryJobs.value === 'Y'
        ? <div className="input-section">
          <h4>Employment</h4>
          <hr/>
          <div className="input-section">
            <GrowableTable
                component={EmploymentPeriod}
                createRow={createEmploymentPeriod}
                data={this.props.data}
                initializeCurrentElement={() => this.props.initializeFields(periodFields, 'nonMilitaryJobs')}
                onRowsUpdate={(update) => {this.props.onStateChange('nonMilitaryJobs', update);}}
                path="/employment-history/employment-information"
                rows={this.props.data.nonMilitaryJobs}
                isValidSection={isValidPage}/>
          </div>
        </div>
      : null}
    </fieldset>
    );
  }
}

EmploymentHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  initializeFields: React.PropTypes.func.isRequired
};
