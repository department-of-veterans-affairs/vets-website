import React from 'react';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';

class EditPhoneModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = this.props.phoneResponseData || {};
    this.props.onChange(defaultFieldValue);
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.props.field.value);
  }

  onChange = (field) => {
    return ({ target: { value } }) => {
      const newFieldValue = {
        ...this.props.field.value,
        [field]: value
      };
      this.props.onChange(newFieldValue);
    };
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-phone-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        {this.props.field && (
          <form onSubmit={this.onSubmit}>
            <label htmlFor="cc">Country Code</label>
            <input type="text" name="cc" onChange={this.onChange('countyCode')} value={this.props.field.value.countryCode}/>
            <label htmlFor="number">Number</label>
            <input type="text" name="number" onChange={this.onChange('number')} value={this.props.field.value.number}/>
            <label htmlFor="ex">Extension</label>
            <input type="text" name="ex" onChange={this.onChange('extension')} value={this.props.field.value.extension}/>
            <LoadingButton isLoading={this.props.isLoading}>Save Phone</LoadingButton>
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
