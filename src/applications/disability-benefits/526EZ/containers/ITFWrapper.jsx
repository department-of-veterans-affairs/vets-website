import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';
import { createITF as createITFAction, fetchITF as fetchITFAction } from '../actions';


const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];

const noITFPages = ['/introduction', '/confirmation'];
// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
const evssDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const outputDateFormat = 'MMMM DD, YYYY';
const displayDate = (dateString) => moment(dateString, evssDateFormat).format(outputDateFormat);

const itfMessage = (headline, content, status) => (
  <div className="usa-grid full-page-alert">
    <AlertBox
      isVisible
      headline={headline}
      content={content}
      status={status}/>
  </div>
);


export class ITFWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDisplayedSuccess: false
    };
  }


  // When we first enter the form...
  componentDidMount() {
    // ...fetch the ITF if needed
    if (!noITFPages.includes(this.props.location.pathname)
      && this.props.itf.fetchCallState === requestStates.notCalled) {
      this.props.fetchITF();
    }
  }


  componentWillReceiveProps(nextProps) {
    const { itf, location } = nextProps;

    if (noITFPages.includes(location.pathname)) {
      return;
    }

    // We now know we've navigated to a page that requires ITF logic

    if (itf.fetchCallState === requestStates.notCalled) {
      nextProps.fetchITF();
    }

    // If we've already fetched the ITFs, have none active, and haven't already called createITF, submit a new ITF
    const hasActiveITF = itf.currentITF && itf.currentITF.status === itfStatuses.active;
    const createITFCalled = itf.creationCallState !== requestStates.notCalled;
    if (itf.fetchCallState === requestStates.succeeded && !hasActiveITF && !createITFCalled) {
      nextProps.createITF();
    }

    // If we've already displayed the itf success banner, toggle it off when the location changes
    if (hasActiveITF && !this.state.hasDisplayedSuccess
      && nextProps.location.pathname !== this.props.location.pathname) {
      // This will take effect at the same time the re-render for the location change does
      this.setState({ hasDisplayedSuccess: true });
    }
  }


  render() {
    const { location, children, itf } = this.props;
    // If the location is the intro or confirmation pages, don't fetch an ITF
    if (noITFPages.includes(location.pathname)) {
      return children;
    }

    // componentDidMount or componentWillRecieveProps called fetchITF

    // While we're waiting, show the loading indicator...
    if (fetchWaitingStates.includes(itf.fetchCallState)) {
      return <LoadingIndicator message="Checking your Intent to File status..."/>;
    }

    // We'll get here after the fetchITF promise is fulfilled

    if (itf.fetchCallState === requestStates.failed) {
      // TODO: Get better content for this
      return itfMessage('We’re sorry. Something went wrong on our end', 'We can’t access your Intent to File request right now. Please try applying again tomorrow.', 'error');
    }

    // If we have an active ITF, we're good to go--render that form!
    if (itf.currentITF && itf.currentITF.status === itfStatuses.active) {
      if (itf.previousITF) {
        // If there was a previous ITF, we created one; show the creation success message
        const submitSuccessContent = (
          <div>
            <p>Thank you for submitting your Intent to File request for disability compensation. Your Intent to File will expire on {displayDate(itf.currentITF.expirationDate)}.</p>
            {itf.previousITF &&
              <p>
                <strong>Please note:</strong> We found a previous Intent to File request in our records that expired on {displayDate(itf.previousITF.expirationDate)}. This ITF might have been from an application you started, but didn’t finish before the ITF expired. Or, it could have been from a claim you already submitted.
              </p>
            }
          </div>
        );

        return (
          <div>
            {!this.state.hasDisplayedSuccess && itfMessage('Your Intent to File request has been submitted', submitSuccessContent, 'success')}
            {children}
          </div>
        );
      }

      // We fetched an active ITF
      return (
        <div>
          {!this.state.hasDisplayedSuccess && itfMessage(
            'You already have an Intent to File',
            `Our records show that you already have an Intent to File for disability compensation. Your Intent to File will expire on ${displayDate(itf.currentITF.expirationDate)}.`,
            'success')}
          {children}
        </div>
      );
    }

    // componentWillRecieveProps called createITF if there was no active ITF found

    // While we're waiting (again), show the loading indicator...again
    if (fetchWaitingStates.includes(itf.creationCallState)) {
      return <LoadingIndicator message="Submitting a new Intent to File..."/>;
    }

    // We'll get here after the createITF promise is fulfilled and we have no active ITF
    //  because of a failed creation call
    // TODO: Get better content for this
    return itfMessage('Your Intent to File didn’t go through', 'We’re sorry. Your Intent to File request didn’t go through because something went wrong on our end. Please try applying again tomorrow.', 'error');
  }
}


const requestStateEnum = Object.values(requestStates);

const itfShape = {
  id: PropTypes.string,
  creationDate: PropTypes.string,
  expirationDate: PropTypes.string.isRequired,
  participantId: PropTypes.number,
  source: PropTypes.string,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

ITFWrapper.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  itf: PropTypes.shape({
    fetchCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    creationCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    currentITF: PropTypes.shape(itfShape),
    previousITF: PropTypes.shape(itfShape)
  }),
  fetchITF: PropTypes.func.isRequired,
  createITF: PropTypes.func.isRequired
};


const mapStateToProps = (store) => ({
  itf: store.itf
});

const mapDispatchToProps = {
  createITF: createITFAction,
  fetchITF: fetchITFAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ITFWrapper);
