import PropTypes from 'prop-types';
import React from 'react';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { isBefore, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { buildDateFormatter } from '../utils/helpers';

export default function DueDate({ date }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstFriendlyEvidenceRequests = useToggleValue(
    TOGGLE_NAMES.cstFriendlyEvidenceRequests,
  );
  const now = new Date();
  const dueDate = parseISO(date);
  const pastDueDate = isBefore(dueDate, now);
  const className = pastDueDate ? 'past-due' : 'due-file';

  const formattedClaimDate = buildDateFormatter()(date);
  let dueDateHeader = '';

  if (cstFriendlyEvidenceRequests) {
    if (pastDueDate) {
      dueDateHeader = '(due date passed)';
    } else {
      dueDateHeader = '';
    }
  } else if (pastDueDate) {
    dueDateHeader = `Needed from you by ${formattedClaimDate} - Due ${formatDistanceToNowStrict(
      dueDate,
    )} ago`;
  } else {
    dueDateHeader = `Needed from you by ${formattedClaimDate}`;
  }
  return (
    <div className="due-date-header">
      {cstFriendlyEvidenceRequests ? (
        <p className="vads-u-margin-top--0 vads-u-color--error-dark">
          {dueDateHeader}
        </p>
      ) : (
        <strong className={className}>{dueDateHeader}</strong>
      )}
    </div>
  );
}

DueDate.propTypes = {
  date: PropTypes.string.isRequired,
};
