import React from 'react';
import { connect } from 'react-redux';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Vet360EditModal from '../base/Vet360EditModal';

import { getEnrollmentStatus as getEnrollmentStatusAction } from 'applications/hca/actions';
import { isEnrolledInVAHealthCare } from 'applications/hca/selectors';

import { FIELD_NAMES } from 'vet360/constants';

import { profileShowReceiveTextNotifications } from 'applications/personalization/profile360/selectors';

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
        isTextable: false,
        isTextPermitted: false,
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

export function mapStateToProps(state, ownProps) {
  const { fieldName } = ownProps;
  return {
    fieldName,
    showReceiveTextNotifications: profileShowReceiveTextNotifications(state),
    isEnrolledInVAHealthCare: isEnrolledInVAHealthCare(state),
  };
}

const mapDispatchToProps = {
  getEnrollmentStatus: getEnrollmentStatusAction,
};

const PhoneEditModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneEditModal);

export default PhoneEditModalContainer;
