import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import CollapsiblePanel from '../../common/components/CollapsiblePanel';
import DownloadLetterLink from '../components/DownloadLetterLink';
import VeteranBenefitSummaryLetter from './VeteranBenefitSummaryLetter';

import { letterContent } from '../utils/helpers';
import { AVAILABILITY_STATUSES, LETTER_TYPES } from '../utils/constants';

export class LetterList extends React.Component {
  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const letterItems = (this.props.letters || []).map((letter, index) => {
      let content;
      let letterTitle;
      let bslHelpInstructions;
      if (letter.letterType === LETTER_TYPES.benefitSummary) {
        letterTitle = 'Benefit Summary and Service Verification Letter';
        content = (<VeteranBenefitSummaryLetter/>);
        bslHelpInstructions = (
          <p>
            If your service period or disability status information is incorrect, please send us
            a message through VA’s <a target="_blank" href="https://iris.custhelp.com/app/ask">
            Inquiry Routing & Information System (IRIS)</a>. VA will respond within 5 business days.
          </p>
        );
      } else if (letter.letterType === LETTER_TYPES.proofOfService) {
        letterTitle = 'Proof of Service Card';
        content = letterContent[letter.letterType] || '';
      } else {
        letterTitle = letter.name;
        content = letterContent[letter.letterType] || '';
      }

      let downloadLetterLink;
      if (this.props.optionsAvailable) {
        downloadLetterLink = (
          <DownloadLetterLink
            letterType={letter.letterType}
            letterName={letter.name}
            downloadStatus={downloadStatus[letter.letterType]}
            key={`download-link-${index}`}/>
        );
      }

      return (
        <CollapsiblePanel
          panelName={letterTitle}
          key={`collapsiblePanel-${index}`}>
          <div>{content}</div>
          <div>{downloadLetterLink}</div>
          <div>{bslHelpInstructions}</div>
        </CollapsiblePanel>
      );
    });

    let eligibilityMessage;
    if (this.props.lettersAvailability === AVAILABILITY_STATUSES.letterEligibilityError) {
      eligibilityMessage = (
        <div className="usa-alert usa-alert-warning">
          <div className="usa-alert-body">
            <h2 className="usa-alert-heading">Some letters may not be available</h2>
            <p className="usa-alert-text">
              One of our systems appears to be down. If you believe you are missing a
              letter or document from the list above, please try again later.
            </p>
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
          To download a letter, you’ll need the latest version of Adobe Reader. It’s free to download. <a href="https://get.adobe.com/reader/" target="_blank">Get Adobe Reader</a>
        </p>
        <p>
          <Link to="confirm-address">Go back to edit address</Link>
        </p>
        {letterItems}
        {eligibilityMessage}

        <br/>
        <h4>Can’t find what you’re looking for?</h4>
        <p>
          This system doesn’t include every VA letter. Find out how to access other VA letters and documents you might need.
        </p>
        <ul>
          <li><a href="/education/gi-bill/post-9-11/ch-33-benefit" target="_blank"><strong>View and print your Post-9/11 GI Bill statement of benefits.</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/coe" target="_blank"><strong>Log into eBenefits to request a Certificate of Eligibility (COE) for your home loan benefits.</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/DPRIS" target="_blank"><strong>Log into eBenefits to request a copy of your discharge or separation papers (DD 214).</strong></a></li>
        </ul>
        <div className="feature help-desk">
          <h2>Need help?</h2>
          <div>If you have any questions, please call the Vets.gov Help Desk:</div>
          <div><a href="tel:855-574-7286">1-855-574-7286</a></div>
          <div>Monday - Friday, 8 a.m. - 8 p.m. (ET)</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus,
    optionsAvailable: letterState.optionsAvailable
  };
}

export default connect(mapStateToProps)(LetterList);
