import React from 'react';
import ErrorableRadioButtons from '../../common/components/form-elements/ErrorableRadioButtons';
import GrowableTable from '../../common/components/form-elements/GrowableTable';
import RotcScholarship from './RotcScholarship';
import { createRotcScholarship } from '../utils/veteran';
import { isValidSection } from '../utils/validations';

export default class RotcHistoryFields extends React.Component {
  render() {
    const scholarshipFields = [
      'amount',
      'year'
    ];

    return (<fieldset>
      <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
      <p>ROTC placeholder</p>
      <div className="input-section">

        <GrowableTable
            component={RotcScholarship}
            createRow={createRotcScholarship}
            data={this.props.data}
            initializeCurrentElement={() => this.props.initializeFields(scholarshipFields, 'seniorRotcScholarships')}
            onRowsUpdate={(update) => {this.props.onStateChange('seniorRotcScholarships', update);}}
            path="military-history/rotc-history"
            rows={this.props.data.seniorRotcScholarships}
            isValidSection={isValidSection}/>

        <ErrorableRadioButtons
            label="Are you currently participating in a senior ROTC scholarship program that pays for your tuition, fees, books and supplies under Section 2107 of Title 10, U.S. Code?"
            options={['Yes', 'No']}
            value={{ value: 'Yes', dirty: false }}
            name="RotcTuition"
            onValueChange={(update) => {this.props.onStateChange('seniorRotcIsParticipating', update);}}/>

      </div>
    </fieldset>
    );
  }
}

RotcHistoryFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
