import React from 'react';
import { connect } from 'react-redux';
import findIndex from 'lodash/fp/findIndex';

import FormTitle from '../../common/schemaform/FormTitle';
import SegmentedProgressBar from '../../common/components/SegmentedProgressBar';

import StepHeader from '../components/StepHeader';
import { chapters } from '../routes';

class DownloadLetters extends React.Component {
  constructor() {
    super();
    this.navigateToLetterList = this.navigateToLetterList.bind(this);
  }

  navigateToLetterList() {
    this.props.router.push('/letter-list');
  }

  render() {
    const { children, location } = this.props;
    const currentPageIndex = findIndex(['path', location.pathname], chapters);
    const currentStep = currentPageIndex + 1;

    let viewLettersButton;
    if (location.pathname === '/confirm-address') {
      viewLettersButton = (
        <button onClick={this.navigateToLetterList} className="usa-button-primary view-letters-button">View letters</button>
      );
    }

    return (
      <div className="usa-width-three-fourths letters">
        <FormTitle title="VA Letters and Documents"/>
        <div className="va-introtext">
          <p>
            To receive some benefits, Veterans and their surviving spouse or family members need a letter proving their Veteran or survivor status. You can download these benefit letters and documents online.
          </p>
        </div>

        <div className="letters-progress-bar">
          <SegmentedProgressBar total={chapters.length} current={currentStep}/>
        </div>
        <StepHeader name={chapters[currentPageIndex].name} current={currentStep} steps="2">
          {children}
          {viewLettersButton}
        </StepHeader>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  const letterState = state.letters;
  return {
    profile: userState.profile,
    letters: letterState.letters,
    destination: letterState.destination,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable
  };
}

export default connect(mapStateToProps)(DownloadLetters);
