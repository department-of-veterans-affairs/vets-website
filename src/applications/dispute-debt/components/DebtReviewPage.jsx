import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../utils';
import { deductionCodes } from '../constants';

const DebtReviewPage = ({ data, editPage, pagePerItemIndex, name }) => {
  const debt = data?.selectedDebts?.[pagePerItemIndex];

  if (!debt) {
    return (
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Debt {parseInt(pagePerItemIndex, 10) + 1} of{' '}
            {data?.selectedDebts?.length || 0}
          </h4>
          <va-button
            secondary
            class="edit-page"
            onClick={editPage}
            label="Edit"
            text="Edit"
            uswds
          />
        </div>
      </div>
    );
  }

  const amount = debt.currentAr || debt.originalAr || 0;
  const debtTitle =
    debt.label || deductionCodes[debt.deductionCode] || 'VA debt';
  const total = data?.selectedDebts?.length || 0;
  const debtNumber = parseInt(pagePerItemIndex, 10) + 1;
  const dynamicTitle =
    debt.label ||
    `Debt ${debtNumber} of ${total}: ${currency(amount)} for ${debtTitle}`;

  // Determine what fields to show based on the page name
  const isDisputeReason = name === 'disputeReason';
  const isSupportStatement = name === 'supportStatement';

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {dynamicTitle}
        </h4>
        <va-button
          secondary
          class="edit-page"
          onClick={editPage}
          label={`Edit ${dynamicTitle}`}
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        {isDisputeReason &&
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
        {isSupportStatement &&
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
};

export default DebtReviewPage;
