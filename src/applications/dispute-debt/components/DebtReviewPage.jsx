import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { currency, setDocumentTitle } from '../utils';
import { deductionCodes } from '../constants';

const DebtReviewPage = ({ data, pagePerItemIndex, name, goToPath }) => {
  const debt = data?.selectedDebts?.[pagePerItemIndex];

  useEffect(() => {
    setDocumentTitle('Review your disputed debts');
  }, []);

  const handleEdit = useCallback(
    () => {
      if (goToPath) {
        goToPath(`/existence-or-amount/${pagePerItemIndex}`);
      }
    },
    [goToPath, pagePerItemIndex],
  );

  if (name && name.includes('disputeReason')) {
    return null;
  }

  const amount = debt?.currentAr || debt?.originalAr || 0;
  const debtTitle =
    debt?.label || deductionCodes[(debt?.deductionCode)] || 'VA debt';
  const total = data?.selectedDebts?.length || 0;
  const debtNumber = parseInt(pagePerItemIndex, 10) + 1;
  const dynamicTitle =
    debt?.label ||
    `Debt ${debtNumber} of ${total}: ${currency(amount)} for ${debtTitle}`;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {dynamicTitle}
        </h4>
        <va-button
          secondary
          class="edit-page"
          onClick={handleEdit}
          label={`Edit ${dynamicTitle}`}
          text="Edit"
        />
      </div>
      <dl className="review">
        {debt?.disputeReason && (
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
        {debt?.supportStatement && (
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
  pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  goToPath: PropTypes.func,
  name: PropTypes.string,
};

export default DebtReviewPage;
