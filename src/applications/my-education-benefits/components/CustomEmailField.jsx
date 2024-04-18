import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isValidEmail } from 'platform/forms/validations';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';
import { fetchDuplicateContactInfo } from '../actions';

function CustomEmailField(props) {
  function handleChange(event) {
    const email = event; // Assuming event carries the email value
    const mobilePhone = props?.mobilePhone || '';

    // Set the email in formData
    props.setFormData({
      ...props?.formData,
      email: {
        ...props?.formData?.email,
        email,
      },
    });

    // If valid email, check for duplicates
    if (email && isValidEmail(email)) {
      props.fetchDuplicateContactInfo(
        [{ value: email, dupe: '' }],
        [{ value: mobilePhone, dupe: '' }],
      );
    }
  }

  return (
    <>
      <EmailWidget {...props} onChange={handleChange} value={props.email} />
    </>
  );
}

CustomEmailField.propTypes = {
  fetchDuplicateContactInfo: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  email: PropTypes.string,
  mobilePhone: PropTypes.string,
};

const mapStateToProps = state => ({
  email: state?.form?.data?.email?.email,
  mobilePhone: state?.form?.data['view:phoneNumbers']?.mobilePhoneNumber?.phone,
  formData: state?.form?.data,
});

const mapDispatchToProps = {
  fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEmailField);
