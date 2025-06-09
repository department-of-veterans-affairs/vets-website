import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../utils';
import { deductionCodes } from '../constants';

const DebtReviewPage = ({ data, pagePerItemIndex, name, goToPath }) => {
  const debt = data?.selectedDebts?.[pagePerItemIndex];
  const total = data?.selectedDebts?.length || 0;
  const debtNumber = parseInt(pagePerItemIndex, 10) + 1;

  // Generate title - handle case when debt is not provided
  let dynamicTitle;
  if (!debt) {
    dynamicTitle = `Debt ${debtNumber} of ${total}`;
  } else {
    const amount = debt.currentAr || debt.originalAr || 0;
    const debtTitle = deductionCodes[debt.deductionCode] || 'VA debt';
    dynamicTitle =
      debt.label ||
      `Debt ${debtNumber} of ${total}: ${currency(amount)} for ${debtTitle}`;
  }

  // Function to navigate to specific page for editing
  const editSpecificPage = () => {
    // Navigate to the beginning of the dispute reason flow for this debt
    // This takes users to the first page (dispute reason selection) even if they want to edit their comment
    // The pagePerItemIndex should be 0-based for the first debt, 1 for second debt, etc.
    if (goToPath) {
      goToPath(`/existence-or-amount/${pagePerItemIndex}`);
    }
  };

  // Determine what fields to show based on the page name
  const showDisputeReason = name === 'disputeReason';
  const showSupportStatement = name === 'supportStatement';

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {dynamicTitle}
        </h4>
        <va-button
          secondary
          class="edit-page"
          onClick={editSpecificPage}
          label={`Edit ${dynamicTitle}`}
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        {debt &&
          showDisputeReason &&
          debt.disputeReason && (
            <div className="review-row">
              <dt>Reason for dispute</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="dispute reason"
              >
                {debt.disputeReason}
              </dd>
            </div>
          )}
        {debt &&
          showSupportStatement &&
          debt.supportStatement && (
            <div className="review-row">
              <dt>Why you’re disputing this debt</dt>
              <dd
                className="dd-privacy-hidden"
                data-dd-action-name="support statement"
              >
                {debt.supportStatement}
              </dd>
            </div>
          )}
      </dl>
    </div>
  );
};

DebtReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  name: PropTypes.string,
  goToPath: PropTypes.func,
};

export default DebtReviewPage;
