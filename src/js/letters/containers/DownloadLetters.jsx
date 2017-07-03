import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';
import AddressSection from '../components/AddressSection';
import LetterList from '../components/LetterList';
import StepHeader from '../components/StepHeader';

class DownloadLetters extends React.Component {
  render() {
    return (
      <div>
        <FormTitle title="Download Your VA Verification Letters"/>
        <div className="va-introtext">
          <p>
            For some benefits, Veterans or surviving spouses and dependents need a letter from the VA proving Veteran or surviving status. This tool will allow you to get these letters online.
          </p>
        </div>
        <StepHeader name="Review your address" current="1" steps="2">
          <AddressSection destination={this.props.destination}/>
        </StepHeader>
        <StepHeader name="Select and Download Letters" current="2" steps="2">
          <LetterList
              letters={this.props.letters}
              benefitSummaryOptions={this.props.benefitSummaryOptions}/>
        </StepHeader>
        <br/>
        <h4>Can't find what you're looking for?</h4>
        <p>This system doesn't include everything VA could send you. Here are some other documents you might be looking for.</p>
        <ul>
          <li><a href="/education/gi-bill/post-9-11/ch-33-benefit" target="_blank"><strong>View and print your Post-9/11 GI Bill benefit details to verify eligibility</strong></a></li>
          <li><a href="https://gibill.custhelp.com/app/ask" target="_blank"><strong>Request a Certificate of Eligibility (COE) for your Post-9/11 GI Bill benefits</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/coe" target="_blank"><strong>Request a Certificate of Eligibility (COE) for your Home Loan benefits</strong></a></li>
          <li><a href="https://eauth.va.gov/ebenefits/DPRIS" target="_blank"><strong>View and print your DD 214</strong></a></li>
        </ul>
        <div className="feature help-desk">
          <h2>Get Adobe Reader</h2>
          <div>To download and view your letters, please make sure you have the latest free version of Adobe Reader.</div>
          <a href="https://get.adobe.com/reader/" target="_blank">Get Adobe Reader</a>
        </div>
        <div className="feature help-desk">
          <h2>Need help?</h2>
          <div>Call the Vets.gov Help Desk.</div>
          <div>1-855-574-7286</div>
          <div>Monday - Friday, 8:00am - 8:00pm (ET)</div>
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
    lettersAvailable: letterState.lettersAvailable,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable
  };
}

export default connect(mapStateToProps)(DownloadLetters);
