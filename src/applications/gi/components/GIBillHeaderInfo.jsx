import React from 'react';
import { getGIBillHeaderText } from '../utils/helpers';

export const renderPTag = (automatedTest = false) => {
  return (
    <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
      {getGIBillHeaderText(automatedTest)}
    </p>
  );
};

export default function GIBillHeaderInfo() {
  return (
    <div className="row vads-u-padding-x--2p5 small-screen:vads-u-padding-x--0 vads-u-padding-bottom--2 small-screen:vads-u-padding-bottom--4">
      <h1
        className="vads-u-text-align--center small-screen:vads-u-text-align--left"
        data-testid="comparison-tool-title"
      >
        GI Bill® Comparison Tool
      </h1>
      {renderPTag()}
    </div>
  );
}
