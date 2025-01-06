import React, { useEffect } from 'react';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import { HelpTextGeneral, HelpTextModalities } from '../../HelpText';

const CantFilePage = ({ pageIndex, setPageIndex, setCantFile }) => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  const onBack = e => {
    e.preventDefault();
    setCantFile(false);
    setPageIndex(pageIndex);
  };

  return (
    <div>
      <h1 tabIndex="-1">
        We can’t file this type of travel reimbursement claim in this tool at
        this time
      </h1>
      <HelpTextModalities />
      <h2 className="vads-u-font-size--h4">
        How can I get help with my claim?
      </h2>
      <HelpTextGeneral />
      <br />
      <va-button
        class="vads-u-margin-y--2"
        text="Back"
        onClick={e => onBack(e)}
      />
    </div>
  );
};

CantFilePage.propTypes = {
  pageIndex: PropTypes.number,
  setCantFile: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default CantFilePage;
