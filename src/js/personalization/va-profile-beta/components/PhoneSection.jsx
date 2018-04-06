import React from 'react';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';
import LoadingButton from './LoadingButton';

class EditPhoneModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.phoneResponseData || { number: '' };
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
      this.props.onChange(newFieldValue, dirty);
    };
  }

  render() {
    const {
      title,
      onClose,
      isLoading,
      field
    } = this.props;

    return (
      <Modal id="profile-phone-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        {field && (
          <form onSubmit={this.onSubmit}>

            <ErrorableTextInput
              autoFocus
              label="Country Code"
              field={{ value: field.value.countryCode, dirty: false }}
              onValueChange={this.onChange('countryCode')}/>

            <ErrorableTextInput
              label="Number"
              field={{ value: field.value.number, dirty: false }}
              onValueChange={this.onChange('number')}
              errorMessage={field.errorMessage}/>

            <ErrorableTextInput
              label="Extension"
              field={{ value: field.value.extension, dirty: false }}
              onValueChange={this.onChange('extension')}/>

            <LoadingButton isLoading={isLoading}>Save Phone</LoadingButton>
          </form>
        )}
      </Modal>
    );
  }
}


export default function PhoneSection({ phoneResponseData, title, field, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
  let phoneDisplay = <button type="button" onClick={onEdit} className="usa-button usa-button-secondary">Add</button>;
  let modal = null;

  if (phoneResponseData) {
    const number = <PhoneNumberWidget value={phoneResponseData.number}/>;
    const countryCode = phoneResponseData.countryCode && <span>+ {phoneResponseData.countryCode}</span>;
    const extension = phoneResponseData.extension && <span>x{phoneResponseData.extension}</span>;
    phoneDisplay = <div>{countryCode} {number} {extension}</div>;
  }

  if (isEditing) {
    modal = (
      <EditPhoneModal
        title={`Edit ${title.toLowerCase()}`}
        field={field}
        onChange={onChange}
        phoneResponseData={phoneResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={phoneResponseData && onEdit}>{title}</HeadingWithEdit>
      {phoneDisplay}
    </div>
  );
}
