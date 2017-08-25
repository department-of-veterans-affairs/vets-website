import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';
// import AddressSection from '../components/AddressSection';
// import LetterList from '../components/LetterList';
// import StepHeader from '../components/StepHeader';

class DownloadLetters extends React.Component {
  render() {
    return (
      <div className="usa-width-three-fourths letters">
        <FormTitle title="VA Letters and Documents"/>
        <div className="va-introtext">
          <p>
            To receive some benefits, Veterans and their surviving spouse or family members need a letter proving their Veteran or survivor status. You can download these benefit letters and documents online.
          </p>
        </div>
        {this.props.children}
        <br/>
        <h4>Can’t find what you’re looking for?</h4>
        <p>
          This system doesn’t include every VA letter. Learn more about how to access other VA letters and documents you might need.
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
          <div>855-574-7286</div>
          <div>Monday - Friday, 8 a.m. - 8 p.m. (ET)</div>
        </div>
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

// <StepHeader name="Review your address" current="1" steps="2">
//           <AddressSection destination={this.props.destination}/>
//         </StepHeader>
//         <StepHeader name="Select and download" current="2" steps="2">
//           <LetterList
//             letters={this.props.letters}
//             lettersAvailability={this.props.lettersAvailability}
//             letterDownloadStatus={this.props.letterDownloadStatus}
//             benefitSummaryOptions={this.props.benefitSummaryOptions}/>
//         </StepHeader>
