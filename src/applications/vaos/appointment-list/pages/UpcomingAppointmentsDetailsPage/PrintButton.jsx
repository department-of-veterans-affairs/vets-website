import React from 'react';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from '../../../utils/constants';

const handleClick = () => {
  return () => {
    recordEvent({ event: `${GA_PREFIX}-print-list-clicked` });
    window.print();
  };
};

export default function PrintButton() {
  return (
    <div className="vaos-hide-for-print">
      <button
        className="tertiary-button vads-u-display--flex vads-u-align-items--center"
        onClick={handleClick()}
        type="button"
        data-testid="print-list"
        id="print-list"
      >
        <span className="vads-u-margin-right--0p5">
          <va-icon icon="print" size="3" aria-hidden="true" />
        </span>
        PRINT
      </button>
    </div>
  );
}
