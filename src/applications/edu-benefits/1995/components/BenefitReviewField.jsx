import React from 'react';
import PropTypes from 'prop-types';
import { benefitsLabelsUpdate } from '../../utils/labels';

const BenefitReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;

  // Get the label from benefitsLabelsUpdate or fall back to formData
  const label = benefitsLabelsUpdate[formData] || formData;

  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {label}
      </dd>
    </div>
  );
};

BenefitReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.string,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default BenefitReviewField;
