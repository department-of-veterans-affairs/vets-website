import React from 'react';
import PropTypes from 'prop-types';

const ReviewRowView = ({ children }) => {
  return (
    <dl className="review">
      <div className="review-row">
        <dt>{children?.props?.uiSchema?.['ui:title']}</dt>
        <dd>{children}</dd>
      </div>
    </dl>
  );
};

ReviewRowView.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.object,
  }),
};

export default ReviewRowView;
