import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BddShaAlert from './BddShaAlert';
import { isBDD } from '../utils';

const hasShaDocumentUploaded = formData =>
  (formData?.separationHealthAssessmentUploads || []).length > 0;

function CustomReviewTopContent({ formData }) {
  const showBddShaAlert =
    isBDD(formData) &&
    formData?.disability526NewBddShaEnforcementWorkflowEnabled &&
    !hasShaDocumentUploaded(formData);

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
