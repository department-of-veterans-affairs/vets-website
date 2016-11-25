import React from 'react';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import ErrorableCheckbox from '../../../common/components/form-elements/ErrorableCheckbox';
import Phone from '../../../common/components/questions/Phone';
import Address from '../Address';

export default class SecondaryContactFields extends React.Component {
  render() {
    return (
      <fieldset>
        <legend>Secondary contact</legend>
        <p>This person should know where you can be reached at all times.</p>
        <p><span className="form-required-span">*</span>Indicates a required field</p>
        <div className="input-section">
          <ErrorableTextInput
              label="Name"
              name="secondaryContactName"
              field={this.props.data.secondaryContact.fullName}
              onValueChange={(update) => {this.props.onStateChange('secondaryContact.fullName', update);}}/>
          <Phone
              additionalClass="usa-input-medium"
              label="Telephone number"
              name="secondaryContactPhone"
              value={this.props.data.secondaryContact.phone}
              onValueChange={(update) => {this.props.onStateChange('secondaryContact.phone', update);}}/>
        </div>
        <div className="input-section">
          <h4>Address</h4>
          <ErrorableCheckbox
              label="Address for secondary contact is the same as mine."
              name="secondaryContactSameAddress"
              checked={this.props.data.secondaryContact.sameAddress}
              onValueChange={(update) => {this.props.onStateChange('secondaryContact.sameAddress', update);}}/>
          {!this.props.data.secondaryContact.sameAddress
            ? <Address
                value={this.props.data.secondaryContact.address}
                onUserInput={(update) => {this.props.onStateChange('secondaryContact.address', update);}}/>
            : null}
        </div>
      </fieldset>
    );
  }
}

SecondaryContactFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
