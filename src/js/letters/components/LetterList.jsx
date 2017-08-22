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
        content = (
          <div>
            <VeteranBenefitSummaryLetter/>
            <DownloadLetterLink
                letterType={letter.letterType}
                letterName={letter.name}
                downloadStatus={downloadStatus[letter.letterType]}
                key={`download-link-${index}`}/>
            <p>
              If your service period or disability status information is incorrect, please send us
              a message through VA’s <a target="_blank" href="https://iris.custhelp.com/app/ask">
              Inquiry Routing & Information System (IRIS)</a>. VA will respond within 5 business days.
            </p>
          </div>
        );
      } else {
        content = (
          <div>
            <div>{letterContent[letter.letterType] || ''}</div>
            <DownloadLetterLink
                letterType={letter.letterType}
                letterName={letter.name}
                downloadStatus={downloadStatus[letter.letterType]}
                key={`download-link-${index}`}/>
          </div>
        );
      }

      return (
        <CollapsiblePanel
          panelName={letter.name}
          key={`collapsiblePanel-${index}`}>
          <div>{content}</div>
        </CollapsiblePanel>
      );
    });

    let eligibilityMessage;
    if (this.props.lettersAvailability === 'letterEligibilityError') {
      eligibilityMessage = (
        <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h2 className="usa-alert-heading">Some letters may not be available</h2>
            <p className="usa-alert-text">
              One of our systems appears to be down. If you believe you are missing a
              letter or document from the list above, please try again later.
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
          To see an explanation about each letter, click on the (+) to expand the box. After you expand the box, you’ll be given the option to download the letter.
        </p>
        <p>
          To download a letter, you’ll need the latest version of Adobe Reader. It’s free to download. <a href="https://get.adobe.com/reader/">Get Adobe Reader</a>
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
