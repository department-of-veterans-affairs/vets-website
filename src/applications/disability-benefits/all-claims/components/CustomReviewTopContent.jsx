import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BddShaAlert from './BddShaAlert';

function CustomReviewTopContent({ formData }) {
  const showBddShaAlert =
    formData?.disability526NewBddShaEnforcementWorkflowEnabled;

  return <>{showBddShaAlert && <BddShaAlert />}</>;
}

CustomReviewTopContent.propTypes = {
  formData: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    formData: state.form.data,
  };
};

export default connect(mapStateToProps)(CustomReviewTopContent);
