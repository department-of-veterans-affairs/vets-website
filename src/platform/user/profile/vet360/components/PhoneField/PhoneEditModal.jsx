import React from 'react';
import { connect } from 'react-redux';

import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Vet360EditModal from '../base/Vet360EditModal';

import { isEnrolledInVAHealthCare as isEnrolledInVAHealthCareSelector } from 'applications/hca/selectors';

import { FIELD_NAMES } from 'vet360/constants';

import { profileShowReceiveTextNotifications } from 'applications/personalization/profile360/selectors';

import ContactInfoForm from '../ContactInfoForm';
import environment from 'platform/utilities/environment';

const useNewForm = !environment.isProduction();

class PhoneTextInput extends ErrorableTextInput {
  // componentDidMount() {
  //   const wrapper = document.createElement('div');
  //   wrapper.className = 'usa-only-phone-wrapper';

  //   const inputField = document.querySelector('input.usa-only-phone');

  //   inputField.parentNode.insertBefore(wrapper, inputField);
  //   wrapper.appendChild(inputField);

  //   const prefixEl = document.createElement('span');
  //   prefixEl.innerText = '+1';
  //   prefixEl.className = 'usa-only-phone-prefix';
  //   inputField.insertAdjacentElement('beforebegin', prefixEl);
  // }

  render() {
    return <ErrorableTextInput {...this.props} type="tel" />;
  }
}

class ReceiveTextMessagesCheckbox extends ErrorableCheckbox {
  render() {
    const showCheckbox =
      this.props.showReceiveTextNotifications &&
      this.props.isEnrolledInVAHealthCare &&
      this.props.isTextable;
    return showCheckbox ? <ErrorableCheckbox {...this.props} /> : null;
  }
}

class PhoneEditModal extends React.Component {
  // @todo Add propTypes

  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

  onChange = field => ({ value, dirty }) => {
    const newFieldValue = { ...this.props.field.value, [field]: value };

    this.props.onChange(newFieldValue, dirty);
  };

  onCheckboxChange = event => {
    const newFieldValue = { ...this.props.field.value, isTextPermitted: event };
    this.props.onChange(newFieldValue, false);
  };

  getInitialFormValues = () => {
    let defaultFieldValue;

    if (this.props.data) {
      defaultFieldValue = {
        ...this.props.data,
        inputPhoneNumber: `${this.props.data.areaCode}${
          this.props.data.phoneNumber
        }`,
        extension: this.props.data.extension || '',
        isTextPermitted: this.props.data.isTextPermitted || false,
        'view:showSMSCheckbox': this.props.showSMSCheckbox,
      };
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        inputPhoneNumber: '',
        isTextable: false,
        isTextPermitted: false,
        'view:showSMSCheckbox': this.props.showSMSCheckbox,
      };
    }

    return defaultFieldValue;
  };

  renderOldForm = () => (
    <div>
      <AlertBox isVisible status="info">
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>
      <div className="vads-u-padding-y--1p5">
        <PhoneTextInput
          additionalClass="usa-only-phone"
          label="Number"
          charMax={14}
          required
          field={{
            value: this.props.field.value.inputPhoneNumber,
            dirty: false,
          }}
          onValueChange={this.onChange('inputPhoneNumber')}
          errorMessage={this.props.field.validations.inputPhoneNumber}
        />
      </div>
      <div className="vads-u-padding-y--1p5">
        <ErrorableTextInput
          label="Extension"
          charMax={10}
          field={{ value: this.props.field.value.extension, dirty: false }}
          onValueChange={this.onChange('extension')}
        />
      </div>

      <ReceiveTextMessagesCheckbox
        showReceiveTextNotifications={this.props.showReceiveTextNotifications}
        isEnrolledInVAHealthCare={this.props.isEnrolledInVAHealthCare}
        isTextable={this.props.fieldName === FIELD_NAMES.MOBILE_PHONE}
        label="Send me text message (SMS) reminders for my VA health care appointments"
        checked={this.props.field.value.isTextPermitted}
        onValueChange={this.onCheckboxChange}
      />
    </div>
  );

  renderForm = (formButtons, onSubmit) => {
    if (!useNewForm) {
      return this.renderOldForm();
    }
    return (
      <ContactInfoForm
        formData={this.props.field.value}
        formSchema={this.props.field.formSchema}
        uiSchema={this.props.field.uiSchema}
        onUpdateFormData={this.props.onChangeFormDataAndSchemas}
        onSubmit={onSubmit}
      >
        {formButtons}
      </ContactInfoForm>
    );
  };

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        onBlur={useNewForm ? null : this.onBlur}
        useSchemaForm={useNewForm}
        {...this.props}
      />
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const showReceiveTextNotifications = profileShowReceiveTextNotifications(
    state,
  );
  const isEnrolledInVAHealthCare = isEnrolledInVAHealthCareSelector(state);
  const showSMSCheckbox =
    ownProps.fieldName === FIELD_NAMES.MOBILE_PHONE &&
    showReceiveTextNotifications &&
    isEnrolledInVAHealthCare;
  return {
    showReceiveTextNotifications,
    isEnrolledInVAHealthCare,
    showSMSCheckbox,
  };
}

const PhoneEditModalContainer = connect(mapStateToProps)(PhoneEditModal);

export default PhoneEditModalContainer;
