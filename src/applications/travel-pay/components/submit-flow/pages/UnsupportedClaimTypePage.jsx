import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';

const UnsupportedClaimTypePage = ({
  pageIndex,
  setIsUnsupportedClaimType,
  setPageIndex,
}) => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  const onBack = () => {
    setIsUnsupportedClaimType(false);
    setPageIndex(pageIndex);
  };

  return (
    <div>
      <h1 tabIndex="-1">We can’t file this claim in this tool at this time</h1>
      <HelpTextModalities />
      <h2 className="vads-u-font-size--h4">
        How can I get help with my claim?
      </h2>
      <HelpTextGeneral />
      <br />
      <va-button class="vads-u-margin-y--2" text="Back" onClick={onBack} />
    </div>
  );
};

UnsupportedClaimTypePage.propTypes = {
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default UnsupportedClaimTypePage;
