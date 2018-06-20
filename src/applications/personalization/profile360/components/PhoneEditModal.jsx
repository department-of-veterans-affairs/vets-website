import React from 'react';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import Vet360EditModal from './Vet360EditModal';

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
  onChange = (field) => {
    return ({ value, dirty }) => {
      const newFieldValue = {
        ...this.props.field.value,
        [field]: value
      };
      // The `dirty` flag triggers validation to run. We only validate
      // the number at this point in time, so we only run it if that's the field changing.
      this.props.onChange(newFieldValue, field === 'number' ? dirty : false);
    };
  }

  getInitialFormValues = () => {
    let defaultFieldValue;

    if (this.props.data) {
      defaultFieldValue = merge(this.props.data, {
        inputPhoneNumber: this.props.data && [this.props.data.areaCode, this.props.data.phoneNumber].join('')
      });
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        phoneNumber: ''
      };
    }

    return defaultFieldValue;
  }

  isEmpty = () => {
    return !(this.props.data && this.props.data.phoneNumber);
  }

  renderForm = () => {
    return (
      <div>
        <AlertBox
          isVisible
          status="info">
          <p>We can only support U.S. phone numbers right now. If you have an international number, please check back later.</p>
        </AlertBox>

        <PhoneTextInput
          additionalClass="usa-only-phone"
          label="Number"
          field={{ value: this.props.field.value.inputPhoneNumber, dirty: false }}
          onValueChange={this.onChange('inputPhoneNumber')}
          errorMessage={this.props.field.errorMessage}/>

        <ErrorableTextInput
          label="Extension"
          field={{ value: this.props.field.value.extension, dirty: false }}
          onValueChange={this.onChange('extension')}/>
      </div>
    );
  }

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        {...this.props}/>
    );
  }
}
