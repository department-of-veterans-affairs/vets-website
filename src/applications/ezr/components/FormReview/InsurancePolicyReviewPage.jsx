import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const InsurancePolicyReviewPage = ({ data, editPage }) => {
  const { providers } = data;
  const reviewRows = providers.map((item, index) => {
    const { insuranceName, insurancePolicyHolderName } = item;
    return (
      <div key={index} className="review-row">
        <dt className="dd-privacy-mask" data-dd-action-name="Insurance policy">
          <strong>{insuranceName}</strong>, {insurancePolicyHolderName}
        </dt>
        <dd>&nbsp;</dd>
      </div>
    );
  });

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        {providers.length ? (
          <>
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                {content['insurance-review-header-title']}
              </h4>
              <button
                type="button"
                onClick={editPage}
                className="edit-btn primary-outline"
                aria-label={content['insurance-edit-button-aria-label']}
              >
                {content['button-edit']}
              </button>
            </div>
            <dl className="review">{reviewRows}</dl>
          </>
        ) : (
          <>
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                {content['insurance-review-header-title']}
              </h4>
            </div>
            <dl className="review">
              <div className="review-row">
                <dt>{content['insurance-coverage-question']}</dt>
                <dd>{content['review-answer-no']}</dd>
              </div>
            </dl>
          </>
        )}
      </form>
    </div>
  );
};

InsurancePolicyReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};

export default InsurancePolicyReviewPage;
