import React from 'react';
import PropTypes from 'prop-types';
import { reviewEntry } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';

const ConfirmationDisputeInformation = ({ formData }) => {
  const { selectedDebts } = formData;

  return selectedDebts.map(debt => (
    <li key={debt.selectedDebtId}>
      <h4>{debt.label}</h4>
      <ul
        className="vads-u-padding--0"
        data-testid={`${debt.label}+list`}
        style={{ listStyle: 'none' }}
      >
        {reviewEntry(
          null,
          `dispute-reason-${debt.selectedDebtId}`,
          {},
          'Dispute reason',
          debt.disputeReason,
        )}
        {reviewEntry(
          null,
          `dispute-support-statement-${debt.selectedDebtId}`,
          {},
          'Dispute statement',
          debt.supportStatement,
        )}
      </ul>
    </li>
  ));
};

ConfirmationDisputeInformation.propTypes = {
  formData: PropTypes.shape({
    selectedDebts: PropTypes.arrayOf(
      PropTypes.shape({
        selectedDebtId: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        disputeReason: PropTypes.string.isRequired,
        supportStatement: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default ConfirmationDisputeInformation;
