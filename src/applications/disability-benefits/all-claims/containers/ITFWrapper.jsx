import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';
import {
  itfMessage,
  itfError,
  itfSuccess,
  itfActive,
} from '../content/itfWrapper';
import {
  createITF as createITFAction,
  fetchITF as fetchITFAction,
} from '../actions';

const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];

const noITFPages = ['/introduction', '/confirmation'];
export class ITFWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDisplayedSuccess: false,
    };
  }

  // When we first enter the form...
  componentDidMount() {
    // ...fetch the ITF if needed
    if (
      !noITFPages.includes(this.props.location.pathname) &&
      this.props.itf.fetchCallState === requestStates.notCalled
    ) {
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
    const hasActiveITF =
      itf.currentITF && itf.currentITF.status === itfStatuses.active;
    const createITFCalled = itf.creationCallState !== requestStates.notCalled;
    if (
      itf.fetchCallState === requestStates.succeeded &&
      !hasActiveITF &&
      !createITFCalled
    ) {
      nextProps.createITF();
    }

    // If we've already displayed the itf success banner, toggle it off when the location changes
    if (
      hasActiveITF &&
      !this.state.hasDisplayedSuccess &&
      nextProps.location.pathname !== this.props.location.pathname
    ) {
      // This will take effect at the same time the re-render for the location change does
      this.setState({ hasDisplayedSuccess: true });
    }
  }

  render() {
    const { location, children, itf } = this.props;
    // If the location is the intro or confirmation pages, don't show an ITF message
    let message;
    let content;

    if (noITFPages.includes(location.pathname)) {
      message = null;
      content = children;
    } else if (fetchWaitingStates.includes(itf.fetchCallState)) {
      // If we get here, componentDidMount or componentWillRecieveProps called fetchITF
      // While we're waiting, show the loading indicator...
      content = (
        <LoadingIndicator message="Please wait while we check your ITF status." />
      );
    } else if (itf.fetchCallState === requestStates.failed) {
      // We'll get here after the fetchITF promise is fulfilled
      message = itfMessage(
        'We’re sorry. Something went wrong on our end.',
        itfError,
        'error',
      );
    } else if (itf.currentITF && itf.currentITF.status === itfStatuses.active) {
      // If we have an active ITF, we're good to go--render that form!
      content = children;

      // Only show the message on the first page navigation
      if (!this.state.hasDisplayedSuccess) {
        const { expirationDate: currentExpDate } = itf.currentITF;
        if (itf.previousITF) {
          const { expirationDate: prevExpDate } = itf.previousITF;
          // If there was a previous ITF, we created one; show the creation success message
          message = itfMessage(
            'Your Intent to File request has been submitted',
            itfSuccess(itf.previousITF, currentExpDate, prevExpDate),
            'success',
          );
        } else {
          // We fetched an active ITF
          message = itfMessage(
            'You already have an Intent to File',
            itfActive(currentExpDate),
            'success',
          );
        }
      }
    } else if (fetchWaitingStates.includes(itf.creationCallState)) {
      // componentWillRecieveProps called createITF if there was no active ITF found
      // While we're waiting (again), show the loading indicator...again
      content = (
        <LoadingIndicator message="Submitting a new Intent to File..." />
      );
    } else {
      // We'll get here after the createITF promise is fulfilled and we have no active ITF
      //  because of a failed creation call
      message = itfMessage(
        'We’re sorry. Something went wrong on our end.',
        itfError,
        'error',
      );
    }

    return (
      <div>
        {message}
        {content}
      </div>
    );
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
  type: PropTypes.string.isRequired,
};

ITFWrapper.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  itf: PropTypes.shape({
    fetchCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    creationCallState: PropTypes.oneOf(requestStateEnum).isRequired,
    currentITF: PropTypes.shape(itfShape),
    previousITF: PropTypes.shape(itfShape),
  }),
  fetchITF: PropTypes.func.isRequired,
  createITF: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  itf: store.itf,
});

const mapDispatchToProps = {
  createITF: createITFAction,
  fetchITF: fetchITFAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ITFWrapper);
