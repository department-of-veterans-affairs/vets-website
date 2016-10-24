import React from 'react';

import Address from '../Address';
import Email from '../../../common/components/questions/Email';
import Phone from '../../../common/components/questions/Phone';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { contactOptions } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';

export default class ContactInformationFields extends React.Component {
  constructor() {
    super();
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail() {
    if (this.props.data.emailConfirmation.dirty
      && this.props.data.email.value.toLowerCase() !== this.props.data.emailConfirmation.value.toLowerCase()) {
      return 'Please ensure your entries match';
    }

    return undefined;
  }

  render() {
    const isPhoneRequired = this.props.data.preferredContactMethod.value === 'phone';
    return (
      <fieldset>
        <p><span className="form-required-span">*</span>Indicates a required field</p>
        <legend>Contact information</legend>
        <div className="input-section">
          <ErrorableRadioButtons
              label="How would you prefer to be contacted if VA has questions about your application?"
              name="preferredContactMethod"
              options={contactOptions}
              value={this.props.data.preferredContactMethod}
              onValueChange={(update) => {this.props.onStateChange('preferredContactMethod', update);}}/>
        </div>
        <h4>Address</h4>
        <div className="input-section">
          <Address required
              value={this.props.data.veteranAddress}
              onUserInput={(update) => {this.props.onStateChange('veteranAddress', update);}}/>
        </div>
        <h4>Other contact information</h4>
        <p>Please enter as much contact information as possible so VA can get in touch with you, if necessary.</p>
        <div className="input-section">
          <Email label="Email address"
              required
              error={validateIfDirty(this.props.data.email, isNotBlank) ? undefined : 'Please enter a response'}
              email={this.props.data.email}
              additionalClass="first-email"
              onValueChange={(update) => {this.props.onStateChange('email', update);}}/>
          <Email error={this.confirmEmail()} required
              name="emailConfirmation"
              label="Re-enter email address"
              email={this.props.data.emailConfirmation}
              additionalClass="second-email"
              onValueChange={(update) => {this.props.onStateChange('emailConfirmation', update);}}/>
          <Phone
              label="Primary telephone number"
              value={this.props.data.homePhone}
              additionalClass="home-phone va-input-medium-large"
              additionalError={this.props.data.preferredContactMethod.value === 'phone' ? 'This is required due to your preferred contact method.' : ''}
              required={isPhoneRequired}
              onValueChange={(update) => {this.props.onStateChange('homePhone', update);}}/>
          <Phone
              label="Mobile telephone number"
              name="mobilePhone"
              value={this.props.data.mobilePhone}
              additionalClass="mobile-phone va-input-medium-large"
              onValueChange={(update) => {this.props.onStateChange('mobilePhone', update);}}/>
        </div>
      </fieldset>
    );
  }
}

ContactInformationFields.propTypes = {
  onStateChange: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired
};
