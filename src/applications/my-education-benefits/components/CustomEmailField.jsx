import React from 'react';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isValidEmail } from 'platform/forms/validations';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

import { fetchDuplicateContactInfo, updateGlobalEmail } from '../actions';

function CustomEmailField(props) {
  function handleChange(event) {
    if (props?.showMebEnhancements08) {
      if (props.email !== event) {
        props.setFormData({
          ...props?.formData,
          email: {
            ...props?.formData?.email,
            email: event,
          },
        });
      }

      const mobilePhone = props?.mobilePhone ? props?.mobilePhone : '';
      if (event && isValidEmail(event)) {
        props.fetchDuplicateContactInfo(
          [{ value: event, dupe: '' }],
          [{ value: mobilePhone, dupe: '' }],
        );
      } else {
        props.setFormData({
          ...props?.formData,
          email: {
            ...props?.formData?.email,
            email: event,
          },
        });
      }
    }
  }

  return (
    <>
      <EmailWidget {...props} onChange={handleChange} value={props.email} />
    </>
  );
}

CustomEmailField.propTypes = {
  fetchDuplicateContactInfo: PropTypes.func,
  updateGlobalEmail: PropTypes.func,
  email: PropTypes.string,
};

const mapStateToProps = state => ({
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  mobilePhone: state?.form?.data['view:phoneNumbers']?.mobilePhoneNumber?.phone,
  showMebEnhancements08: state?.featureToggles?.showMebEnhancements08,
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
  fetchDuplicateContactInfo,
  updateGlobalEmail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEmailField);
