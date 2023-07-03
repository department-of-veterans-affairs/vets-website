import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import { fetchDuplicateContactInfo, updateGlobalPhoneNumber } from '../actions';

function CustomPhoneNumberField(props) {
  function handleChange(event) {
    if (props?.showMebEnhancements08) {
      props.updateGlobalPhoneNumber(event);
      props.fetchDuplicateContactInfo(props.duplicateEmail, [
        { value: event, isDupe: '' },
      ]);
    }
  }

  return (
    <>
      <PhoneNumberWidget
        {...props}
        onChange={handleChange}
        value={props.phoneNumber}
      />
    </>
  );
}

CustomPhoneNumberField.propTypes = {
  fetchDuplicateContactInfo: PropTypes.func,
  updateGlobalEmail: PropTypes.func,
  phoneNumber: PropTypes.string,
};

const mapStateToProps = state => ({
  phoneNumber: state?.form?.data?.mobilePhone,
  duplicatePhone: state?.data?.duplicatePhone,
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  showMebEnhancements08: state?.data?.showMebEnhancements08,
});

const mapDispatchToProps = {
  fetchDuplicateContactInfo,
  updateGlobalPhoneNumber,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPhoneNumberField);
