import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * ReviewPageHeader - A reusable component for rendering "Edit section" headers and buttons on the review page.
 *
 * @param {String} [title] - Title of section.
 * @param {Function} goToPath - goToPath passed in from CustomPage/CustomPageReview props.
 * @return {React Component}
 */
const ReviewPageHeader = ({ title, goToPath }) => {
  return (
    <div className="form-review-panel-page" key="income-edit-navigation">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header">
          Review {title || 'this section'}
        </h4>
        <VaButton onClick={goToPath} secondary text="Edit section" uswds />
      </div>
      <div className="review-header">
        <p>
          Review {title ? `your ${title}` : `this section`} to ensure the
          accuracy of your request.
        </p>
      </div>
    </div>
  );
};

ReviewPageHeader.propTypes = {
  goToPath: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ReviewPageHeader;
