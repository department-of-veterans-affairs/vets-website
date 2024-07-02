import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DD_ACTIONS_PAGE_TYPE } from '../../util/constants';

const BeforeYouDownloadDropdown = ({ page }) => {
  const content = useMemo(
    () => {
      if (page === DD_ACTIONS_PAGE_TYPE.DETAILS) {
        return (
          <ul>
            <li>
              <strong>If you print or download this page,</strong> we’ll include
              a list of allergies and reactions in your VA medical records.
            </li>
            <li>
              <strong>If you’re on a public or shared computer,</strong>{' '}
              remember that downloading saves a copy of your records to the
              computer you’re using.
            </li>
          </ul>
        );
      }
      return (
        <>
          <strong>If you’re on a public or shared computer,</strong> remember
          that downloading saves a copy of your records to the computer you’re
          using.
        </>
      );
    },
    [page],
  );

  return (
    <div className="before-you-download-dropdown" data-testid="before-download">
      <va-additional-info
        trigger="What to know before you print or download"
        data-testid="dropdown-info"
        data-dd-action-name={`What To Know Before You Print Or Download Button - ${page}`}
        uswds
      >
        {content}
      </va-additional-info>
    </div>
  );
};

BeforeYouDownloadDropdown.propTypes = {
  page: PropTypes.string.isRequired,
};

export default BeforeYouDownloadDropdown;
