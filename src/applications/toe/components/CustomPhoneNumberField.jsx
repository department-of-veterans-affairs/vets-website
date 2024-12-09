import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import { fetchDuplicateContactInfo, updateGlobalPhoneNumber } from '../actions';

function CustomPhoneNumberField(props) {
  function handleChange(event) {
    if (props?.toeDupContactInfoCall) {
      props?.updateGlobalPhoneNumber(event);
      if (event?.length > 9) {
        props.fetchDuplicateContactInfo(props.duplicateEmail, [
          { value: event, dupe: '' },
        ]);
      }

      props?.setFormData({
        ...props?.formData,
        duplicatePhone: [{ value: '', dupe: '' }],
        'view:phoneNumbers': {
          ...props.formData['view:phoneNumbers'],
          mobilePhoneNumber: {
            ...props.formData['view:phoneNumbers'].mobilePhoneNumber,
            phone: event,
          },
        },
      });
    }
  }

  return (
    <>
      <PhoneNumberWidget
        {...props}
        onChange={handleChange}
        value={props?.mobilePhone}
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
  mobilePhone: state?.form?.data['view:phoneNumbers']?.mobilePhoneNumber?.phone,
  duplicatePhone: state?.data?.duplicatePhone,
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  toeDupContactInfoCall: state?.featureToggles?.toeDupContactInfoCall,
  formData: state?.form?.data,
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
