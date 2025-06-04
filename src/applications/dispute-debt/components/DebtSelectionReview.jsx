import React from 'react';
import PropTypes from 'prop-types';

const DebtSelectionReview = ({ data, editPage }) => {
  const { selectedDebts = [] } = data;

  if (!selectedDebts.length) {
    return (
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Debt Selection
          </h4>
          <va-button
            secondary
            class="edit-page"
            onClick={editPage}
            label="Edit debt selection"
            text="Edit"
            uswds
          />
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Selected debts</dt>
            <dd
              className="dd-privacy-hidden"
              data-dd-action-name="selected debts"
            >
              No debts selected
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Debt Selection
        </h4>
        <va-button
          secondary
          class="edit-page"
          onClick={editPage}
          label="Edit debt selection"
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Selected debts ({selectedDebts.length})</dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="selected debts"
          >
            <ul className="vads-u-margin-top--0">
              {selectedDebts.map((debt, index) => (
                <li key={debt.selectedDebtId || index}>{debt.label}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
};

DebtSelectionReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
};

export default DebtSelectionReview;
