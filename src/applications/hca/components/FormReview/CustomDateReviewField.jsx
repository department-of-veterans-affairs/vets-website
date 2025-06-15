import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/helpers';

const CustomDateReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  const formattedDate = formatDate(formData, 'MM/dd/yyyy');
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {formattedDate}
      </dd>
    </div>
  );
};

CustomDateReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.string,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default CustomDateReviewField;
