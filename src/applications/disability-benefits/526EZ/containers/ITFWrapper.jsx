import React from 'react';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { fetchStates } from '../../../../platform/utilities/constants';


const fetchWaitingStates = [fetchStates.notCalled, fetchStates.pending];


export default class ITFWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createITFCallState: fetchStates.notCalled,
      itfFetchState: fetchStates.notCalled,
      itfIsActive: null
    };
  }


  fetchITF() {
    // Set the itfFetchState to pending
    // Fetch the ITF
    // If it's successful, set itfFetchState to succeeded
    //   Set itfIsActive to true or false accordingly
    // Else set it to failed
  }


  submitITF() {
    // Set createITFCall to pending
    // Make the call
    // If successfull, set createITFCallState to success
    //   Set itfIsActive to true or false accordingly (probably just true?)
    // Else set it to failed
  }


  render() {
    const { location, children } = this.props;

    // If the location is the intro or confirmation pages, don't fetch an ITF
    if (['/introduction', '/confirmation'].includes(location.pathname)) {
      return children;
    }

    // If we haven't checked the ITF status yet, do so
    if (this.state.itfFetchState === fetchStates.notCalled) {
      this.fetchITF();
    }

    // While we're waiting, show the loading indicator...
    if (fetchWaitingStates.includes(this.state.itfFetchState)) {
      return <LoadingIndicator message="Checking your Intent to File status..."/>;
    }

    // We'll get here after the fetchITF promise is fulfilled

    if (this.itfFetchState === fetchStates.failed) {
      // render error alert
    }

    // If we have an active ITF, we're good to go--render that form!
    if (this.state.itfIsActive) {
      return children;
    }

    // If not, try to submit a new ITF
    if (this.state.createITFCallState === fetchStates.notCalled) {
      this.submitITF();
    }

    // While we're waiting (again), show the loading indicator...again
    if (fetchWaitingStates.includes(this.state.itfFetchState)) {
      return <LoadingIndicator message="Submitting a new Intent to File..."/>;
    }

    // We'll get here after the createITF promise is fulfilled and we have no active ITF
    //  because of a failed creation call
    return (
      <AlertBox
        status="error"
        headline="We’re sorry, we couldn’t find an active ITF nor file a new one for you. Please try again later."/>
    );
  }
}
