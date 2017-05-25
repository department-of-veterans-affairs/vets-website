import PropTypes from 'prop-types';
import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import { validateIfDirty, isNotBlank } from '../../../common/utils/validations';
import { validateIfDirtyProvider, isValidInsurancePolicy } from '../../utils/validations';

class Provider extends React.Component {
  render() {
    let content;

    // TODO: to look into why provider data isn't getting updated in the store as it's being entered
    if (this.props.view === 'collapsed') {
      content = this.props.data.insuranceName.value;
    } else {
      content = (
        <div className="input-section">
          <ErrorableTextInput required
              errorMessage={validateIfDirty(this.props.data.insuranceName, isNotBlank) ? undefined : 'Please enter the insurer’s name'}
              charMax={100}
              label="Name of provider"
              name="insuranceName"
              field={this.props.data.insuranceName}
              onValueChange={(update) => {this.props.onValueChange('insuranceName', update);}}/>

          <ErrorableTextInput required
              errorMessage={validateIfDirty(this.props.data.insurancePolicyHolderName, isNotBlank) ? undefined : 'Please enter the name of the policy holder'}
              charMax={50}
              label="Name of policy holder"
              name="insurancePolicyHolderName"
              field={this.props.data.insurancePolicyHolderName}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyHolderName', update);}}/>

          <ErrorableTextInput required
              errorMessage={validateIfDirtyProvider(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode, isValidInsurancePolicy) ? undefined : 'Please enter the policy number or group code'}
              charMax={30}
              label="Policy number (either this or group code is required)"
              name="insurancePolicyNumber"
              field={this.props.data.insurancePolicyNumber}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyNumber', update);}}/>

          <ErrorableTextInput required
              errorMessage={validateIfDirtyProvider(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode, isValidInsurancePolicy) ? undefined : 'Please enter the policy number or group code'}
              charMax={30}
              label="Group code (either this or policy number is required)"
              name="insuranceGroupCode"
              field={this.props.data.insuranceGroupCode}
              onValueChange={(update) => {this.props.onValueChange('insuranceGroupCode', update);}}/>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

Provider.propTypes = {
  data: PropTypes.object.isRequired,
  view: PropTypes.string,
  onValueChange: PropTypes.func.isRequired
};

export default Provider;
