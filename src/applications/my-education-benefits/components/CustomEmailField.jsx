import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

import { fetchDuplicateContactInfo, updateGlobalEmail } from '../actions';

function CustomEmailField(props) {
  useEffect(() => {
    // @NOTE: We need an initial run with the values coming from vadir/va profile to check.
    // Any changes to the values will be picked up by the handle change
    if (props?.showMebEnhancements08) {
      props.fetchDuplicateContactInfo(
        [{ value: props.email, dupe: '' }],
        [{ value: props.phoneNumber, dupe: '' }],
      );
    }
  }, []);

  function handleChange(event) {
    if (props?.showMebEnhancements08) {
      props.updateGlobalEmail(event);
      props.fetchDuplicateContactInfo(
        [{ value: event, dupe: '' }],
        props.duplicatePhone,
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
  fetchDuplicateContactInfo: PropTypes.func,
  updateGlobalEmail: PropTypes.func,
  email: PropTypes.string,
};
const mapStateToProps = state => ({
  email: state?.form?.data?.email?.email,
  duplicateEmail: state?.data?.duplicateEmail,
  phoneNumber: state?.form?.data?.mobilePhone,
  duplicatePhone: state?.data?.duplicatePhone,
  showMebEnhancements08: state?.featureToggles?.showMebEnhancements08,
});

const mapDispatchToProps = {
  fetchDuplicateContactInfo,
  updateGlobalEmail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEmailField);
