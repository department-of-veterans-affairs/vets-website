import PropTypes from 'prop-types';
import React from 'react';

/**
 * Benefits Information Review component
 * Displays benefit entitlement information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for benefits information
 */
export const BenefitsInformationReview = ({ data, editPage, title }) => {
  const benefitsInformation = data?.benefitsInformation || {};
  const veteranInfo = data?.veteranInformation || {};

  const veteranName =
    veteranInfo.firstName || veteranInfo.lastName
      ? `${veteranInfo.firstName || ''} ${veteranInfo.lastName || ''}`.trim()
      : 'the Veteran';

  const employerName = data?.employerInformation?.employerName || 'you';

  const formatYesNo = value => {
    if (!value) return 'Not provided';
    return value === 'yes' ? 'Yes' : 'No';
  };

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
            Is {veteranName} receiving or entitled to receive, as a result of
            their employment with {employerName}, sick, retirement or other
            benefits?
          </dt>
          <dd>{formatYesNo(benefitsInformation.benefitEntitlement)}</dd>
        </div>
      </dl>
    </div>
  );
};

BenefitsInformationReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default BenefitsInformationReview;
