import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/helpers';

const CustomDateReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd className="dd-privacy-hidden" data-dd-action-name="data value">
      {formatDate(formData, 'MM/dd/yyyy')}
    </dd>
  </div>
);

CustomDateReviewField.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
};

export default CustomDateReviewField;
