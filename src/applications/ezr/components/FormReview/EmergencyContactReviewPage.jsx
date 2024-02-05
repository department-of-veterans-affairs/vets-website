import React from 'react';
import PropTypes from 'prop-types';
import { normalizeFullName } from '../../utils/helpers/general';
import content from '../../locales/en/content.json';

const EmergencyContactReviewPage = ({ data, editPage }) => {
  const { veteranContacts } = data;
  const reviewRows = veteranContacts.map((item, index) => {
    const { fullName, relationship } = item;
    const emergencyContactName = normalizeFullName(fullName);
    return (
      <div key={index} className="review-row">
        <dt className="dd-privacy-mask" data-dd-action-name="Dependent">
          <strong>{emergencyContactName}</strong>, {relationship}
        </dt>
        <dd>&nbsp;</dd>
      </div>
    );
  });

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        {veteranContacts.length ? (
          <>
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                {content['household-dependent-review-header-title']}
              </h4>
              <button
                type="button"
                onClick={editPage}
                className="edit-btn primary-outline"
                aria-label={
                  content['household-dependent-edit-button-aria-label']
                }
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
                {content['household-dependent-review-header-title']}
              </h4>
            </div>
            <dl className="review">
              <div className="review-row">
                <dt>{content['household-dependent-report-question']}</dt>
                <dd>{content['review-answer-no']}</dd>
              </div>
            </dl>
          </>
        )}
      </form>
    </div>
  );
};

EmergencyContactReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};

export default EmergencyContactReviewPage;
