import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import { fetchDuplicateContactInfo, updateGlobalPhoneNumber } from '../actions';

function CustomPhoneNumberField(props) {
  function handleChange(event) {
    const phoneNumber = event; // Assuming event is the phone number value
    props.updateGlobalPhoneNumber(phoneNumber);
    // Trigger fetching duplicate contact info if the phone number length is appropriate
    if (phoneNumber?.length > 9) {
      props.fetchDuplicateContactInfo(props.duplicateEmail, [
        { value: phoneNumber, dupe: '' },
      ]);
    }
    // Update form data with the new phone number
    props.setFormData({
      ...props.formData,
      duplicatePhone: [{ value: '', dupe: '' }],
      'view:phoneNumbers': {
        ...props.formData['view:phoneNumbers'],
        mobilePhoneNumber: {
          ...props.formData['view:phoneNumbers'].mobilePhoneNumber,
          phone: phoneNumber,
        },
      },
    });
  }
  return (
    <PhoneNumberWidget
      {...props}
      onChange={handleChange}
      value={props.mobilePhone}
    />
  );
}
CustomPhoneNumberField.propTypes = {
  fetchDuplicateContactInfo: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  updateGlobalPhoneNumber: PropTypes.func.isRequired,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  mobilePhone: PropTypes.string,
};
const mapStateToProps = state => ({
  mobilePhone: state.form?.data['view:phoneNumbers']?.mobilePhoneNumber?.phone,
  duplicatePhone: state.data?.duplicatePhone,
  duplicateEmail: state.data?.duplicateEmail,
  formData: state.form?.data,
});
const mapDispatchToProps = {
  setFormData: setData,
  fetchDuplicateContactInfo,
  updateGlobalPhoneNumber,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPhoneNumberField);
