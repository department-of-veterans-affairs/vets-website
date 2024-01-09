import React from 'react';
import { connect } from 'react-redux';
import findIndex from 'lodash/findIndex';
import { Outlet, useLocation } from 'react-router-dom-v5-compat';

import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';

import { chapters } from '../utils/chapters';

export function DownloadLetters() {
  const location = useLocation();
  const currentPageIndex = findIndex(chapters, ['path', location.pathname]);
  const currentStep = currentPageIndex + 1;
  const total = chapters.length;
  const headerText = `Step ${currentStep} of ${total}: ${
    chapters[currentPageIndex].name
  }`;

  return (
    <div className="usa-width-three-fourths letters">
      <FormTitle title="VA letters and documents" />
      <p className="va-introtext">
        To receive some benefits, Veterans need a letter proving their status.
        You can download some of these benefit letters and documents online.
      </p>
      <va-segmented-progress-bar total={total} current={currentStep} />
      <div className="section-content">
        <h2 id="nav-form-header" className="vads-u-font-size--h4">
          {headerText}
        </h2>
        <Outlet />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const userState = state.user;
  const letterState = state.letters;
  return {
    profile: userState.profile,
    letters: letterState.letters,
    fullName: letterState.fullName,
    address: letterState.address,
    isEditingAddress: letterState.isEditingAddress,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo,
    },
    optionsAvailable: letterState.optionsAvailable,
  };
}

export default connect(mapStateToProps)(DownloadLetters);
