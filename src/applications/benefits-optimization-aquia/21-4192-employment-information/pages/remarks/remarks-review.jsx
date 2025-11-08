import PropTypes from 'prop-types';
import React from 'react';

/**
 * Remarks Review component
 * Displays remarks information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for remarks
 */
export const RemarksReview = ({ data, editPage, title }) => {
  const remarksData = data?.remarks || {};
  const veteranInfo = data?.veteranInformation || {};

  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <va-button secondary uswds text="Edit" onClick={editPage} />
      </div>

      <dl className="review">
        <div className="review-row">
          <dt>
            Provide any additional remarks about {veteranName} related to their
            employment.
          </dt>
          <dd>{remarksData.remarks || 'Not provided'}</dd>
        </div>
      </dl>
    </div>
  );
};

RemarksReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default RemarksReview;
