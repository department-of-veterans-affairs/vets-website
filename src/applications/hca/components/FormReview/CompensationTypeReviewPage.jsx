import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import content from '../../locales/en/content.json';

export const TEXT_LABELS = {
  highDisability: content['benefits--disability-rating-high-label'],
  lowDisability: content['benefits--disability-rating-low-label'],
  default: content['form--default-no-label'],
};

const CompensationTypeReviewPage = ({ data }) => {
  const compensationType = useMemo(
    () => TEXT_LABELS[data.vaCompensationType] || TEXT_LABELS.default,
    [data.vaCompensationType],
  );

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {content['benefits--disability-rating-title']}
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>{content['benefits--disability-rating-label']}</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="VA disability compensation"
            >
              {compensationType}
            </dd>
          </div>
        </dl>
        <p className="vads-u-margin-top--1p5">
          {content['benefits--disability-rating-review-disclaimer']}
        </p>
        <p className="vads-u-margin-bottom--0p5">
          <Link to="/va-benefits/basic-information" data-testid="hca-nav-link">
            {content['benefits--disability-rating-review-back-button-text']}
          </Link>
        </p>
      </form>
    </div>
  );
};

CompensationTypeReviewPage.propTypes = {
  data: PropTypes.shape({
    vaCompensationType: PropTypes.string,
  }),
};

export default CompensationTypeReviewPage;
