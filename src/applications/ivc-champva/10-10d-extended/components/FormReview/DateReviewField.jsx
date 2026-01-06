import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const DateReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  const formattedDate = format(formData, 'MM/dd/yyyy');
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd
        className="dd-privacy-hidden"
        data-dd-action-name={uiSchema['ui:title']}
      >
        {formattedDate}
      </dd>
    </div>
  );
};

DateReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.string,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default DateReviewField;
