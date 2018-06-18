import React from 'react';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';

import Vet360EditModal from './Vet360EditModal';

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
        countryCode: '',
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
        <ErrorableTextInput
          autoFocus
          label="Country Code"
          field={{ value: this.props.field.value.countryCode, dirty: false }}
          onValueChange={this.onChange('countryCode')}/>

        <ErrorableTextInput
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
