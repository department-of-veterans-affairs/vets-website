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
    <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
      Learn about and compare your GI Bill benefits at approved schools and
      employers.
    </p>
  );
};

export default function GIBillHeaderInfo() {
  return (
    <div className="row vads-u-padding-x--2p5 small-screen:vads-u-padding-x--0 vads-u-padding-bottom--2 small-screen:vads-u-padding-bottom--4">
      <h1 className="vads-u-text-align--center small-screen:vads-u-text-align--left">
        GI Bill® Comparison Tool
      </h1>
      {renderPTag()}
    </div>
  );
}
