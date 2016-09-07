import React from 'react';

import Address from '../../../common/components/questions/Address';

export default class VeteranAddressFields extends React.Component {
  render() {
    return (
      <fieldset>
        <p>(<span className="form-required-span">*</span>) Indicates a required field</p>
        <p>Permanent Address</p>
        <div className="input-section">
          <Address required
              value={this.props.data.veteranAddress}
              onUserInput={(update) => {this.props.onStateChange('veteranAddress', update);}}/>
        </div>
      </fieldset>
    );
  }
}

VeteranAddressFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
