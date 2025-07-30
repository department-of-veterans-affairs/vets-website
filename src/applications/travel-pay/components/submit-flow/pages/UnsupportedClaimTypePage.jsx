import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { HelpTextModalities } from '../../HelpText';
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
