import React from 'react';
import PhoneNumberWidget from '../../../common/schemaform/review/PhoneNumberWidget';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '../../../common/components/Modal';
import LoadingButton from './LoadingButton';

class EditPhoneModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { phoneResponseData: props.phoneResponseData || {} };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state.phoneResponseData);
  }

  onChange = (field) => {
    return ({ target: { value } }) => {
      const phoneResponseData = {
        ...this.state.phoneResponseData,
        [field]: value
      };
      this.setState({ phoneResponseData });
    };
  }

  render() {
    const { title, onClose } = this.props;
    return (
      <Modal id="profile-phone-modal" onClose={onClose} visible>
        <h3>{title}</h3>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="cc">Country Code</label>
          <input type="text" name="cc" onChange={this.onChange('countyCode')} value={this.state.phoneResponseData.countryCode}/>
          <label htmlFor="number">Number</label>
          <input type="text" name="number" onChange={this.onChange('number')} value={this.state.phoneResponseData.number}/>
          <label htmlFor="ex">Extension</label>
          <input type="text" name="ex" onChange={this.onChange('extension')} value={this.state.phoneResponseData.extension}/>
          <LoadingButton isLoading={this.props.isLoading}>Save Phone</LoadingButton>
        </form>
      </Modal>
    );
  }
}


export default function PhoneSection({ phoneResponseData, title, isEditing, isLoading, onEdit, onCancel, onSubmit }) {
  let phoneDisplay = <em>N/A</em>;
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
        phoneResponseData={phoneResponseData}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onClose={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit onEditClick={onEdit}>{title}</HeadingWithEdit>
      {phoneDisplay}
    </div>
  );
}
