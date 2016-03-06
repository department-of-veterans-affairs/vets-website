import React from 'react';
import Address from './Address';

import Phone from './Phone';
import Email from './Email';
import ErrorableSelect from '../form-elements/ErrorableSelect';

import { countries, states } from '../../utils/options-for-select.js';

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

            <label htmlFor="veteran_street">Street</label>
            <input type="text" name="veteran[street]"/>

            <label htmlFor="veteran_city">City</label>
            <input type="text" name="veteran[city]"/>

            <div className="usa-input-grid usa-input-grid-large">
              <ErrorableSelect label="Country"
                  options={countries}
                  value={this.props.data.country}
                  onUserInput={(update) => {this.props.onStateChange('country', update);}}/>
            </div>

            <div className="usa-input-grid usa-input-grid-large">
              <ErrorableSelect label="State"
                  options={states}
                  value={this.props.data.state}
                  onUserInput={(update) => {this.props.onStateChange('state', update);}}/>
            </div>

            <label htmlFor="veteran_zipcode">Zip Code</label>
            <input type="text" name="veteran[zipcode]"/>

            <label htmlFor="veteran_county">County</label>
            <input type="text" name="veteran[county]"/>

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
