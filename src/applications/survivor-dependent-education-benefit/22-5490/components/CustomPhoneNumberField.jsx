import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import { fetchDuplicateContactInfo } from '../actions';

function CustomPhoneNumberField(props) {
  function handleChange(event) {
    if (event?.length > 9) {
      props?.fetchDuplicateContactInfo(props?.duplicateEmail, [
        { value: event, dupe: '' },
      ]);
    }

    props?.setFormData({
      ...props?.formData,
      duplicatePhone: [{ value: '', dupe: '' }],
      'view:phoneNumbers': {
        ...props.formData['view:phoneNumbers'],
        mobilePhoneNumber: event,
      },
    });
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
  mobilePhone: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    mobilePhone: state?.form?.data?.mobilePhone,
    duplicatePhone: state?.data?.duplicatePhone,
    email: state?.form?.data?.email,
    duplicateEmail: state?.data?.duplicateEmail,
    formData: state?.form?.data,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
  fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPhoneNumberField);
