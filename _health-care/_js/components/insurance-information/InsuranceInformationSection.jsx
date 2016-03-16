import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import Provider from './Provider.jsx';

class InsuranceInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankProvider() {
    return {
      insuranceName: '',
      insuranceAddress: '',
      insuranceCity: '',
      insuranceCountry: '',
      insuranceState: '',
      insuranceZipcode: '',
      insurancePhone: '404-123-1234',
      insurancePolicyHolderName: '',
      insurancePolicyNumber: '',
      insuranceGroupCode: '',
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Coverage Information </h4>
            <ErrorableCheckbox
                label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
                checked={this.props.data.isCoveredByHealthInsurance}
                onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
            <hr/>
            <GrowableTable
                component={Provider}
                createRow={this.createBlankProvider}
                onRowsUpdate={(update) => {this.props.onStateChange('providers', update);}}
                rows={this.props.data.providers}/>
          </div>
        </div>
      </div>
    );
  }
}

export default InsuranceInformationSection;
