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

export const AltReviewRowView = ({ children }) => {
  // children are usually a React element, but are an object on the confirmation page
  const data = React.isValidElement(children)
    ? children
    : children?.props?.formData?.toString();
  return (
    <div className="review-row">
      <dt>{children?.props?.uiSchema?.['ui:title']}</dt>
      <dd>{data}</dd>
    </div>
  );
};

AltReviewRowView.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.object,
  }),
};

export const CurrencyReviewRowView = ({ children }) => {
  return (
    <div className="review-row">
      <dt>{children?.props?.uiSchema?.['ui:title']}</dt>
      <dd>${children}</dd>
    </div>
  );
};

CurrencyReviewRowView.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.object,
  }),
};

export default ReviewRowView;
