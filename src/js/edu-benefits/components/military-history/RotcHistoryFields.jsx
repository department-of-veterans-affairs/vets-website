import React from 'react';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';
import ErrorableNumberInput from '../../../common/components/form-elements/ErrorableNumberInput';
import ExpandingGroup from '../../../common/components/form-elements/ExpandingGroup';
import GrowableTable from '../../../common/components/form-elements/GrowableTable';
import RotcScholarship from './RotcScholarship';
import { createRotcScholarship } from '../../utils/veteran';
import { isValidPage, validateIfDirty, isValidYearOrBlank, isValidRotcScholarshipAmount } from '../../utils/validations';
import { yesNo } from '../../utils/options-for-select';

export default class RotcHistoryFields extends React.Component {
  render() {
    const scholarshipFields = [
      'amount',
      'year'
    ];
    const propertyPath = 'seniorRotc.rotcScholarshipAmounts';
    return (<fieldset>
      <legend>ROTC history</legend>
      <p><span className="form-required-span">*</span>Indicates a required field</p>
      <div className="input-section">
        <ErrorableRadioButtons
            label="Are you currently participating in a senior ROTC scholarship program that pays your tuition, fees, books, and supplies? (Covered under Section 2107 of Title 10, U.S. Code)"
            options={yesNo}
            value={this.props.data.seniorRotcScholarshipProgram}
            name="RotcTuition"
            onValueChange={(update) => {this.props.onStateChange('seniorRotcScholarshipProgram', update);}}/>

        <ExpandingGroup open={this.props.data.seniorRotcCommissioned.value === 'Y'} additionalClass="edu-benefits-rotc-group">
          <ErrorableRadioButtons
              label="Were you commissioned as a result of senior ROTC?"
              name="seniorRotcCommissioned"
              options={yesNo}
              value={this.props.data.seniorRotcCommissioned}
              onValueChange={(update) => {this.props.onStateChange('seniorRotcCommissioned', update);}}/>
          <div>
            <div className="input-section">
              <ErrorableNumberInput
                  additionalClass="usa-input-medium"
                  errorMessage={validateIfDirty(this.props.data.seniorRotc.commissionYear, isValidYearOrBlank) ? undefined : 'Please enter a valid year'}
                  label="Year of commission"
                  min="1900"
                  name="commissionYear"
                  field={this.props.data.seniorRotc.commissionYear}
                  onValueChange={(update) => {this.props.onStateChange('seniorRotc.commissionYear', update);}}/>
            </div>
            <div className="input-section">
              <h4>ROTC scholarships</h4>
              <GrowableTable
                  component={RotcScholarship}
                  createRow={createRotcScholarship}
                  data={this.props.data}
                  initializeCurrentElement={() => this.props.initializeFields(scholarshipFields, propertyPath)}
                  onRowsUpdate={(update) => {this.props.onStateChange(propertyPath, update);}}
                  path="/military-history/rotc-history"
                  rows={this.props.data.seniorRotc.rotcScholarshipAmounts}
                  isValidRow={isValidRotcScholarshipAmount}
                  isValidSection={isValidPage}/>

            </div>
          </div>
        </ExpandingGroup>
      </div>
    </fieldset>
    );
  }
}

RotcHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  initializeFields: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
