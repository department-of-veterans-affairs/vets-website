import React from 'react';
import PropTypes from 'prop-types';

const benefitLabels = {
  fry: 'Fry Scholarship (Chapter 33)',
  dea: "Survivors' and Dependents' Educational Assistance (DEA, Chapter 35)",
};

const BenefitSelectionReview = ({ data, editPage }) => {
  const chosenBenefit = data?.chosenBenefit;
  const benefitLabel =
    chosenBenefit && benefitLabels[chosenBenefit]
      ? benefitLabels[chosenBenefit]
      : 'Not provided';

  return (
    <div className="form-review-panel-page">
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Review benefit selection
        </h4>
        <va-button
          aria-label="Edit benefit selection"
          secondary
          text="Edit"
          onClick={editPage}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Chosen benefit</dt>
          <dd>{benefitLabel}</dd>
        </div>
      </dl>
    </div>
  );
};

BenefitSelectionReview.propTypes = {
  editPage: PropTypes.func.isRequired,
  data: PropTypes.shape({
    chosenBenefit: PropTypes.oneOf(['fry', 'dea']),
  }),
};

BenefitSelectionReview.defaultProps = {
  data: {},
};

export default BenefitSelectionReview;
