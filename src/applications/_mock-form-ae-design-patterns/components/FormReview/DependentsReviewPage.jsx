import React from 'react';
import PropTypes from 'prop-types';
import { normalizeFullName } from '../../utils/helpers/general';
import content from '../../locales/en/content.json';

const DependentsReviewPage = ({ data, editPage }) => {
  const { dependents } = data;
  const reviewRows = dependents.map((item, index) => {
    const { fullName, dependentRelation } = item;
    const dependentName = normalizeFullName(fullName);
    return (
      <div key={index} className="review-row">
        <dt className="dd-privacy-mask" data-dd-action-name="Dependent">
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
                {content['household-dependent-review-header-title']}
              </h4>
              <va-button
                text={content['button-edit']}
                label={content['household-dependent-edit-button-aria-label']}
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

DependentsReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};

export default DependentsReviewPage;
