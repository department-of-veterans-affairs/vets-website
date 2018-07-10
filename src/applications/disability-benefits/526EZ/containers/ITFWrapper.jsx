import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';
import { createITF as createITFAction, fetchITF as fetchITFAction } from '../actions';


const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];
const fulfilledStates = [requestStates.succeeded, requestStates.failed];

const noITFPages = ['/introduction', '/confirmation'];

const itfMessage = (headline, content, status) => (
  <div className="usa-grid" style={{ marginBottom: '2em' }}>
    <AlertBox
      isVisible
      headline={headline}
      content={content}
      status={status}/>
  </div>
);

const itfSuccessContent = (itf) => {
  // TODO: Make this more better
  // TODO: Format the date
  const content = (
    <div>
      <p>Expiration date: {itf.currentITF.expirationDate}</p>
      {itf.previousITF && <AdditionalInfo triggerText="Not what you expected?">
        <p>
          We found a previous ITF that expired on {itf.previousITF.expirationDate}. This might have been from an application that you started and did not finish before expiration, or from an earlier claim that you submitted.
        </p>
      </AdditionalInfo>}
    </div>
  );
  return content;
};


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
    if (!noITFPages.includes(this.props.location.pathname)) {
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
    const fetchITFReturned = fulfilledStates.includes(itf.fetchCallState);
    const hasActiveITF = itf.currentITF && itf.currentITF.status === itfStatuses.active;
    const createITFCalled = itf.creationCallState !== requestStates.notCalled;
    if (fetchITFReturned && !hasActiveITF && !createITFCalled) {
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
      return itfMessage('Looks like something went wrong', 'That\'s a real bummer.', 'error');
    }

    // If we have an active ITF, we're good to go--render that form!
    if (itf.currentITF && itf.currentITF.status === itfStatuses.active) {
      return (
        <div>
          {!this.state.hasDisplayedSuccess && itfMessage('ITF Success', itfSuccessContent(itf), 'success')}
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
    return itfMessage('Something went wrong', 'We’re sorry, we couldn’t find an active ITF nor file a new one for you. Please try again later.', 'error');
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
