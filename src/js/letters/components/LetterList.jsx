import React from 'react';
import PropTypes from 'prop-types';

import CollapsiblePanel from '../../common/components/CollapsiblePanel';
import DownloadLetterLink from './DownloadLetterLink';
import VeteranBenefitSummaryLetter from '../containers/VeteranBenefitSummaryLetter';

import { letterContent } from '../utils/helpers.jsx';

class LetterList extends React.Component {
  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const letterItems = (this.props.letters || []).map((letter, index) => {
      let content;

      if (letter.letterType === 'benefit_summary') {
        content = (<VeteranBenefitSummaryLetter/>);
      } else {
        content = letterContent[letter.letterType] || '';
      }

      return (
        <CollapsiblePanel
            panelName={letter.name}
            key={`collapsiblePanel-${index}`}>
          <div>{content}</div>
          <DownloadLetterLink
              letterType={letter.letterType}
              letterName={letter.name}
              downloadStatus={downloadStatus[letter.letterType]}
              key={`download-link-${index}`}/>
        </CollapsiblePanel>
      );
    });

    let eligibilityMessage;
    if (this.props.lettersAvailability === 'letterEligibilityError') {
      eligibilityMessage = (
        <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h2 className="usa-alert-heading">Letters may be unavailable</h2>
            <p className="usa-alert-text">
              Our system is temporarily down. If you believe you're missing
              a letter or document from this list, please try again later,
              or call:
            </p>
            <ul>
              <li><a href="tel:888-888-8888">888-888-8888</a> for health-related documents</li>
              <li><a href="tel:888-888-8888">888-888-8888</a> for benefits-related documents</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="step-content">
        <p>
          To see what is included in each letter and how it can be used, expand the box
          using the (+). Then, download the letter.
        </p>
        {letterItems}
        {eligibilityMessage}
      </div>
    );
  }
}

LetterList.PropTypes = {
  letters: PropTypes.array,
  lettersAvailability: PropTypes.string,
  benefitSummaryOptions: PropTypes.object,
  letterDownloadStatus: PropTypes.object
};

export default LetterList;
