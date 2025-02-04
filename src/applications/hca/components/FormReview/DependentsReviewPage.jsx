import React from 'react';
import PropTypes from 'prop-types';
import { normalizeFullName } from '../../utils/helpers';

const DependentsReviewPage = ({ data, editPage }) => {
  const { dependents } = data;
  const reviewRows = dependents.map((item, index) => {
    const { fullName, dependentRelation } = item;
    const dependentName = normalizeFullName(fullName);
    return (
      <div key={index} className="review-row">
        <dt className="dd-privacy-hidden" data-dd-action-name="dependent">
          <strong>{dependentName}</strong>, {dependentRelation}
        </dt>
        <dd>&nbsp;</dd>
      </div>
    );
  });

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        {dependents.length ? (
          <>
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                Your Dependents
              </h4>
              <va-button
                text="Edit"
                label="Edit your dependents"
                onClick={editPage}
                secondary
                uswds
              />
            </div>
            <dl className="review">{reviewRows}</dl>
          </>
        ) : (
          <>
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                Your Dependents
              </h4>
            </div>
            <dl className="review">
              <div className="review-row">
                <dt>Do you have any dependents to report?</dt>
                <dd
                  className="dd-privacy-hidden"
                  data-dd-action-name="data value"
                >
                  No
                </dd>
              </div>
            </dl>
          </>
        )}
      </form>
    </div>
  );
};

DependentsReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};

export default DependentsReviewPage;
