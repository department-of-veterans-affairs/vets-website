import React from 'react';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';
import AlertBox from '../../../common/components/AlertBox';

class EditPhoneModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.phoneResponseData || { countryCode: '', extension: '', number: '' };
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


export default function PhoneSection({ phoneResponseData, title, field, error, clearErrors, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
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
        error={error}
        clearErrors={clearErrors}
        onChange={onChange}
        phoneResponseData={phoneResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={onCancel}/>
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
