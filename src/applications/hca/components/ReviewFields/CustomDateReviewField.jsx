import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const CustomDateReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{moment(formData).format('MM/DD/YYYY')}</dd>
  </div>
);

CustomDateReviewField.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
};

export default CustomDateReviewField;
