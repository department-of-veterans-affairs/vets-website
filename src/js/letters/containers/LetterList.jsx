import React from 'react';
import { connect } from 'react-redux';

import CollapsiblePanel from '../../common/components/CollapsiblePanel';
import DownloadLetterLink from '../components/DownloadLetterLink';
import VeteranBenefitSummaryLetter from './VeteranBenefitSummaryLetter';

import { letterContent } from '../utils/helpers.jsx';

export class LetterList extends React.Component {
  render() {
    const downloadStatus = this.props.letterDownloadStatus;
    const letterItems = (this.props.letters || []).map((letter, index) => {
      let content;
      let bslHelpInstructions;
      if (letter.letterType === 'benefit_summary') {
        content = (<VeteranBenefitSummaryLetter/>);
        bslHelpInstructions = (
          <p>
            If your service period or disability status information is incorrect, please send us
            a message through VA’s <a target="_blank" href="https://iris.custhelp.com/app/ask">
            Inquiry Routing & Information System (IRIS)</a>. VA will respond within 5 business days.
          </p>
        );
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
          <div>{bslHelpInstructions}</div>
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
              <li><a href="tel:888-888-8888">1-888-888-8888</a> for health-related documents</li>
              <li><a href="tel:888-888-8888">1-888-888-8888</a> for benefits-related documents</li>
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

        <br/>
        <h4>Can’t find what you’re looking for?</h4>
        <p>
          This system doesn’t include every VA letter. Find out how to access other VA letters and documents you might need.
        </p>
        <ul>
          <li><a href="/education/gi-bill/post-9-11/ch-33-benefit" target="_blank"><strong>View and print your Post-9/11 GI Bill benefits summary and eligibility.</strong></a></li>
          <li><a href="https://gibill.custhelp.com/app/ask" target="_blank"><strong>Request a Certificate of Eligibility (COE) for your Post-9/11 GI Bill benefits.</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/coe" target="_blank"><strong>Request a Certificate of Eligibility (COE) for your home loan benefits.</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/DPRIS" target="_blank"><strong>Request a copy of your discharge or separation papers (DD214).</strong></a></li>
        </ul>
        <p>
          Please visit <a href="https://www.ebenefits.va.gov/" target="_blank">eBenefits</a> for any document or letter not listed here.
        </p>
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
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    letterDownloadStatus: letterState.letterDownloadStatus
  };
}

export default connect(mapStateToProps)(LetterList);
