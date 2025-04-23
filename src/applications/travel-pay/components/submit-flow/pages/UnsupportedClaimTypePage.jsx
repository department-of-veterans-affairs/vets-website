import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';
import {
  recordSmocButtonClick,
  recordSmocPageview,
} from '../../../util/events-helpers';

const title = 'We can’t file this claim in this tool at this time';

const UnsupportedClaimTypePage = ({
  pageIndex,
  setIsUnsupportedClaimType,
  setPageIndex,
}) => {
  useEffect(() => {
    recordSmocPageview('unsupported');
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  useSetPageTitle(title);

  const onBack = () => {
    recordSmocButtonClick('unsupported', 'back');
    setIsUnsupportedClaimType(false);
    setPageIndex(pageIndex);
  };

  return (
    <div>
      <h1 tabIndex="-1">{title}</h1>
      <HelpTextModalities />
      <h2 className="vads-u-font-size--h4">
        How can I get help with my claim?
      </h2>
      <HelpTextGeneral />
      <br />
      <va-button
        disable-analytics
        class="vads-u-margin-y--2"
        text="Back"
        onClick={onBack}
      />
    </div>
  );
};

UnsupportedClaimTypePage.propTypes = {
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default UnsupportedClaimTypePage;
