import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmailWidget from 'platform/forms-system/src/js/widgets/EmailWidget';

import { fetchDuplicateContactInfo, updateGlobalEmail } from '../actions';

function CustomEmailField(props) {
  function handleChange(event) {
    props.fetchDuplicateContactInfo(event);
    props.updateGlobalEmail(event);
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
});

const mapDispatchToProps = {
  fetchDuplicateContactInfo,
  updateGlobalEmail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomEmailField);
