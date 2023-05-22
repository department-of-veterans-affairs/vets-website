import React from 'react';
import PropTypes from 'prop-types';

const DependentsReviewPage = ({ data, editPage }) => {
  const { dependents } = data;
  const reviewRows = dependents.map((item, index) => {
    const { fullName, dependentRelation } = item;
    const normalizedFullName = `${fullName.first} ${
      fullName.last
    } ${fullName.suffix || ''}`.replace(/ +(?= )/g, '');
    return (
      <div key={index} className="review-row">
        <dt>
          <strong>{normalizedFullName}</strong>, {dependentRelation}
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
              <button
                type="button"
                onClick={editPage}
                className="edit-btn primary-outline"
                aria-label="Edit your dependents"
              >
                Edit
              </button>
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
                <dd>No</dd>
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
