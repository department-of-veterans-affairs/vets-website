import React from 'react';

import Address from '../questions/Address';
import Email from '../questions/Email';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import Phone from '../questions/Phone';

class VeteranAddressSection extends React.Component {
  constructor() {
    super();
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail() {
    if (this.props.data.email !== this.props.data.emailConfirmation) {
      return 'Please ensure your entries match';
    }

    return undefined;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Permanent Address</h4>

            <p>For locations outside the U.S., enter "City,Country" in the City field
              (e.g., "Paris,France"), and select Foreign Country for State.
            </p>

            <Address value={this.props.data.address}
                onUserInput={(update) => {this.props.onStateChange('address', update);}}/>

            <ErrorableTextInput label="County"
                value={this.props.data.county}
                onValueChange={(update) => {this.onStateChange('county', update);}}/>

            <Email label="Email address"
                value={this.props.data.email}
                onValueChange={(update) => {this.props.onStateChange('email', update);}}/>

            <Email error={this.confirmEmail()}
                label="Re-enter Email address"
                value={this.props.data.emailConfirmation}
                onValueChange={(update) => {this.props.onStateChange('emailConfirmation', update);}}/>

            <Phone label="Home telephone number"
                value={this.props.data.homePhone}
                onValueChange={(update) => {this.props.onStateChange('homePhone', update);}}/>

            <Phone label="Mobile telephone number"
                value={this.props.data.mobilePhone}
                onValueChange={(update) => {this.props.onStateChange('mobilePhone', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default VeteranAddressSection;
