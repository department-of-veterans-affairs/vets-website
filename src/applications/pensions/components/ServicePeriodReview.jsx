import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from 'platform/utilities/date';
import { serviceBranchLabels } from '../labels';

const ServicePeriodReview = ({ data, editPage }) => {
  const {
    serviceBranch = {},
    activeServiceDateRange,
    serviceNumber,
    placeOfSeparation,
  } = data;
  const selectedBranches = Object.keys(serviceBranch).filter(
    branch => serviceBranch[branch],
  );
  const branchLabels = selectedBranches.map(
    branch => serviceBranchLabels[branch],
  );
  const branchesString = branchLabels.join(', ');

  return (
    <div className="form-review-panel-page vads-u-margin-bottom--7">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Service Period
        </h4>
        <va-button
          secondary
          class="vads-u-justify-content--flex-end"
          onClick={editPage}
          label="Edit"
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Branch of service</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="branch of service"
          >
            {branchesString}
          </dd>
        </div>
        {activeServiceDateRange && activeServiceDateRange.from && (
          <div className="review-row">
            <dt>Date initially entered active duty</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="start active service date"
            >
              {formatDateLong(activeServiceDateRange.from)}
            </dd>
          </div>
        )}
        {activeServiceDateRange && activeServiceDateRange.to && (
          <div className="review-row">
            <dt>Final release date from active duty</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="end active service date"
            >
              {formatDateLong(activeServiceDateRange.to)}
            </dd>
          </div>
        )}
        {serviceNumber && (
          <div className="review-row">
            <dt>Military Service number</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="military service number"
            >
              {serviceNumber}
            </dd>
          </div>
        )}
        {placeOfSeparation && (
          <div className="review-row">
            <dt>Place of your last separation</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="place of last separation"
            >
              {placeOfSeparation}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

ServicePeriodReview.propTypes = {
  data: PropTypes.shape({
    serviceBranch: PropTypes.object,
    activeServiceDateRange: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    serviceNumber: PropTypes.string,
  }),
  editPage: PropTypes.func,
};

export default ServicePeriodReview;
