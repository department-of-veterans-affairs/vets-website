import React from 'react';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation/ErrorableTextInput';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import LoadingButton from './LoadingButton';

class EditPhoneModal extends React.Component {

  componentDidMount() {
    let defaultFieldValue;

    if (this.props.phoneData) {
      defaultFieldValue = merge(this.props.phoneData, {
        inputPhoneNumber: this.props.phoneData && [this.props.phoneData.areaCode, this.props.phoneData.phoneNumber].join('')
      });
    } else {
      defaultFieldValue = { countryCode: '', extension: '', phoneNumber: '' };
    }

    this.props.onChange(defaultFieldValue);
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.props.field.errorMessage) return;
    this.props.onSubmit(this.props.field.value);
  }

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

  render() {
    const {
      title,
      onCancel,
      isLoading,
      field,
      clearErrors
    } = this.props;

    return (
      <Modal id="profile-phone-modal" onClose={onCancel} visible>
        <h3>{title}</h3>
        <AlertBox
          isVisible={!!this.props.error}
          status="error"
          content={<p>We’re sorry. We couldn’t update your phone number. Please try again.</p>}
          onCloseAlert={clearErrors}/>
        {field && (
          <form onSubmit={this.onSubmit}>

            <ErrorableTextInput
              autoFocus
              label="Country Code"
              field={{ value: field.value.countryCode, dirty: false }}
              onValueChange={this.onChange('countryCode')}/>

            <ErrorableTextInput
              label="Number"
              field={{ value: field.value.inputPhoneNumber, dirty: false }}
              onValueChange={this.onChange('inputPhoneNumber')}
              errorMessage={field.errorMessage}/>

            <ErrorableTextInput
              label="Extension"
              field={{ value: field.value.extension, dirty: false }}
              onValueChange={this.onChange('extension')}/>

            <LoadingButton isLoading={isLoading}>Update</LoadingButton>
            <button type="button" className="usa-button-secondary" onClick={onCancel}>Cancel</button>
          </form>
        )}
      </Modal>
    );
  }
}

function renderContent({ data: phoneData }) {
  const phoneNumber = <PhoneNumberWidget value={[phoneData.areaCode, phoneData.phoneNumber].join('')}/>;
  const countryCode = phoneData.countryCode && <span>+ {phoneData.countryCode}</span>;
  const extension = phoneData.extension && <span>x{phoneData.extension}</span>;
  return <div>{countryCode} {phoneNumber} {extension}</div>;
}

function renderEditModal({ data: phoneData, title, field, transaction, clearErrors, onChange, onSubmit, onCancel }) {
  return (
    <EditPhoneModal
      title={`Edit ${title.toLowerCase()}`}
      field={field}
      error={transaction && transaction.error}
      clearErrors={clearErrors}
      onChange={onChange}
      phoneData={phoneData}
      onSubmit={onSubmit}
      isLoading={transaction && transaction.isPending}
      onCancel={onCancel}/>
  );
}

export default function Vet360Phone({ title, fieldName, analyticsSectionName }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      renderContent={renderContent}
      renderEditModal={renderEditModal}/>
  );
}
