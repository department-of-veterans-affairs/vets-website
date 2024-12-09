import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const benefitLabels = {
  chapter33: 'Post-9/11 GI Bill (Chapter 33)',
  chapter30: 'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
  chapter1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
};
const BenefitSelectionReviewPage = ({ formData, editPage }) => {
  const { chosenBenefit } = formData || {};
  const renderReviewRow = (label, value) => {
    if (value) {
      return (
        <div className="review-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="form-review-panel-page">
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Benefit Selection
        </h4>
        <va-button
          aria-label="Edit benefit selection"
          secondary
          text="Edit"
          onClick={editPage}
        />
      </div>
      <dl className="review">
        {renderReviewRow(
          'Selected Education Benefit',
          benefitLabels[chosenBenefit],
        )}
      </dl>
    </div>
  );
};

BenefitSelectionReviewPage.propTypes = {
  editPage: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(BenefitSelectionReviewPage);
