import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import content from '../../locales/en/content.json';

const labels = {
  highDisability: content['compensation-type-review--high-disability-label'],
  lowDisability: content['compensation-type-review--low-disability-label'],
  default: content['compensation-type-review--default-label'],
};

const CompensationTypeReviewPage = ({ data }) => {
  const compensationType = useMemo(
    () => labels[data.vaCompensationType] || labels.default,
    [data.vaCompensationType],
  );

  return (
    <div className="form-review-panel-page">
      <form className="rjsf" noValidate="">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {content['compensation-type-review--page-header']}
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>{content['compensation-type-review--question-title']}</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="VA disability compensation"
            >
              {compensationType}
            </dd>
          </div>
        </dl>
        <p className="vads-u-margin-top--1p5">
          {content['compensation-type-review--disclaimer']}
        </p>
        <p className="vads-u-margin-bottom--0p5">
          <Link to="/va-benefits/basic-information" data-testid="hca-nav-link">
            {content['compensation-type-review--back-button-text']}
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
