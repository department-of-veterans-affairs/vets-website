import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import BasicLink from './BasicLink';
import { isBDD } from '../utils';

const hasShaDocumentUploaded = formData =>
  (formData?.separationHealthAssessmentUploads || []).length > 0;

function CustomReviewTopContent({ formData }) {
  const showBddShaAlert =
    isBDD(formData) &&
    formData?.disability526NewBddShaEnforcementWorkflowEnabled &&
    !hasShaDocumentUploaded(formData);

  if (!showBddShaAlert) {
    return null;
  }

  return (
    <VaAlert status="info" visible>
      <h2 slot="headline">
        A Separation Health Assessment (SHA) Part A is required
      </h2>
      <p>
        We want to ensure that we have all the information we need to process
        your claim. If you do not include a SHA Part A as part of your claim, we
        will not be able to deliver a decision within 30 days after separation.
      </p>
      <p>
        <BasicLink
          path="supporting-evidence/additional-evidence"
          search="?redirect"
          text="Check if you've uploaded a SHA Part A document"
        />
      </p>
    </VaAlert>
  );
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
