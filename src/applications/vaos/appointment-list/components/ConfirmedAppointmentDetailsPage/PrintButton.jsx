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
      <button className="tertiary-button" onClick={handleClick()} type="button">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        Print
      </button>
    </div>
  );
}
