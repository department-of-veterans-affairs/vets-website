import React from 'react';
import PropTypes from 'prop-types';

const DateReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  const localeOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate =
    formData &&
    new Date(`${formData}T00:00:00`).toLocaleDateString('en-us', localeOptions);
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
