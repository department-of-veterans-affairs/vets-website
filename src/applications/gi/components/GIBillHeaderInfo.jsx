import React from 'react';
import { isShowVetTec } from '../utils/helpers';

export const renderPTag = (automatedTest = false) => {
  if (isShowVetTec(automatedTest)) {
    return (
      <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
        Learn about and compare your GI Bill benefits at approved schools,
        employers, and VET TEC providers.
      </p>
    );
  }
  return (
    <p className="vads-u-font-size--h3 vads-u-color--gray-dark main-text-subtext">
      Learn about and compare your GI Bill benefits at approved schools and
      employers.
    </p>
  );
};

export default function GIBillHeaderInfo() {
  return (
    <div className="tool-description">
      <h1 className="main-title">GI Bill® Comparison Tool</h1>
      {renderPTag()}
    </div>
  );
}
