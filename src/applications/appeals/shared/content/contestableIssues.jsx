import React from 'react';
import { getTomorrowFormatted, getCurrentTimeZoneAbbr } from '../utils/dates';

export const ContestableIssuesAdditionalInfo = (
  <va-additional-info
    trigger="Why isn’t my issue listed here?"
    class="vads-u-margin-top--3 vads-u-margin-bottom--4"
  >
    If you don’t see your issue or decision listed here, it may not be in our
    system yet. This can happen if it’s a more recent claim decision. If you
    have a decision date, you can add a new issue now.
  </va-additional-info>
);

export const removeModalContent = {
  title: 'Are you sure you want to remove this issue?',
  description: issueName => (
    <span>
      We’ll remove{' '}
      <strong
        className="dd-privacy-hidden word-break-all"
        data-dd-action-name="issue name"
      >
        {issueName}
      </strong>{' '}
      from the issues you’d like us to review
    </span>
  ),
  yesButton: 'Yes, remove this',
  noButton: 'No, keep this',
};

export const getBlockedMessage = blockedIssuesCount => {
  if (!blockedIssuesCount || blockedIssuesCount <= 0) {
    return '';
  }

  const tomorrowFormatted = getTomorrowFormatted();
  const timeZoneAbbr = getCurrentTimeZoneAbbr();

  return blockedIssuesCount === 1
    ? `We're sorry. This issue isn't available to add to your appeal yet. You can come back and select it after ${tomorrowFormatted}, 12:00 a.m. ${timeZoneAbbr}.`
    : `We're sorry. These issues aren't available to add to your appeal yet. You can come back and select them after ${tomorrowFormatted}, 12:00 a.m. ${timeZoneAbbr}.`;
};
