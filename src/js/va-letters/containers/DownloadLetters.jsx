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
          <LetterList letters={this.props.letters}/>
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
    available: letterState.available
  };
}

export default connect(mapStateToProps)(DownloadLetters);
