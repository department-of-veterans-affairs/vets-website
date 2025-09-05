import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

const YellowRibbonInstructionsPage = () => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-margin-top--4 vads-u-padding-x--0">
      <h1>Instructions for completing the Yellow Ribbon Program agreement</h1>
    </div>
  );
};

YellowRibbonInstructionsPage.propTypes = {};

export default YellowRibbonInstructionsPage;
