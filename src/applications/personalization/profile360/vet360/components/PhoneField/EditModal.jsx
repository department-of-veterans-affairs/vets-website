import React from 'react';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import Vet360EditModal from '../base/EditModal';

class PhoneTextInput extends ErrorableTextInput {
  componentDidMount() {
    const wrapper = document.createElement('div');
    wrapper.className = 'usa-only-phone-wrapper';

    const inputField = document.querySelector('input.usa-only-phone');

    inputField.parentNode.insertBefore(wrapper, inputField);
    wrapper.appendChild(inputField);

    const prefixEl = document.createElement('span');
    prefixEl.innerText = '+1';
    prefixEl.className = 'usa-only-phone-prefix';
    inputField.insertAdjacentElement('beforebegin', prefixEl);
  }
}

export default class PhoneEditModal extends React.Component {
  // @todo Add propTypes

  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

  onChange = field => ({ value, dirty }) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value,
    };

    this.props.onChange(newFieldValue, dirty);
  };

  getInitialFormValues = () => {
    let defaultFieldValue;

    if (this.props.data) {
      defaultFieldValue = merge(this.props.data, {
        inputPhoneNumber:
          this.props.data &&
          [this.props.data.areaCode, this.props.data.phoneNumber].join(''),
      });
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        inputPhoneNumber: '',
      };
    }

    return defaultFieldValue;
  };

  renderForm = () => (
    <div>
      <AlertBox isVisible status="info">
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>

      <PhoneTextInput
        additionalClass="usa-only-phone"
        label="Number"
        charMax={14}
        required
        field={{ value: this.props.field.value.inputPhoneNumber, dirty: false }}
        onValueChange={this.onChange('inputPhoneNumber')}
        errorMessage={this.props.field.validations.inputPhoneNumber}
      />

      <ErrorableTextInput
        label="Extension"
        charMax={10}
        field={{ value: this.props.field.value.extension, dirty: false }}
        onValueChange={this.onChange('extension')}
      />
    </div>
  );

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        onBlur={this.onBlur}
        {...this.props}
      />
    );
  }
}
