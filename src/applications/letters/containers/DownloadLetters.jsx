import React from 'react';
import { connect } from 'react-redux';
import findIndex from 'lodash/fp/findIndex';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SegmentedProgressBar from '@department-of-veterans-affairs/component-library/SegmentedProgressBar';

import { chapters } from '../routes';

export function DownloadLetters({ children, location }) {
  const currentPageIndex = findIndex(['path', location.pathname], chapters);
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
      <SegmentedProgressBar total={total} current={currentStep} />
      <div className="section-content">
        <h2 id="nav-form-header" className="vads-u-font-size--h4">
          {headerText}
        </h2>
        {children}
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
