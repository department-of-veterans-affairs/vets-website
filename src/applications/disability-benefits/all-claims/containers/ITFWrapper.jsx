import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { requestStates } from 'platform/utilities/constants';
import ITFBanner from '../components/ITFBanner';
import { isActiveITF } from '../utils';
import { itfStatuses } from '../constants';
import {
  createITF as createITFAction,
  fetchITF as fetchITFAction,
} from '../actions';

const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];

export class ITFWrapper extends React.Component {
  static defaultProps = {
    noITFPages: [/\/start/, /\/introduction/, /\/confirmation/],
  };

  // When we first enter the form...
  componentDidMount() {
    // ...fetch the ITF if needed
    if (
      !this.shouldBlockITF(this.props.location.pathname) &&
      this.props.itf.fetchCallState === requestStates.notCalled
    ) {
      this.props.fetchITF();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { itf, location } = nextProps;
    if (this.shouldBlockITF(location.pathname)) {
      return;
    }

    // We now know we've navigated to a page that requires ITF logic

    if (itf.fetchCallState === requestStates.notCalled) {
      nextProps.fetchITF();
    }

    // If we've already fetched the ITFs, have none active, and haven't already
    // called createITF, submit a new ITF
    const hasActiveITF = isActiveITF(itf.currentITF);

    const createITFCalled = itf.creationCallState !== requestStates.notCalled;
    if (
      (itf.fetchCallState === requestStates.succeeded ||
        itf.fetchCallState === requestStates.failed) &&
      !hasActiveITF &&
      !createITFCalled
    ) {
      nextProps.createITF();
    }
  }

  /**
   * Checks to see if the given pathname should be blocked from making any ITF
   * calls.
   */
  shouldBlockITF(pathname) {
    return this.props.noITFPages.some(
      noITFPath =>
        noITFPath.test ? noITFPath.test(pathname) : noITFPath === pathname,
    );
  }

  showLoading = (title, message, label) => (
    <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
      <div className="usa-content">
        <h1>{title}</h1>
        <va-loading-indicator message={message} label={label} />
      </div>
    </div>
  );

  render() {
    const { itf, title, featureToggles } = this.props;

    if (this.shouldBlockITF(this.props.location.pathname)) {
      return this.props.children;
    }
    if (fetchWaitingStates.includes(itf.fetchCallState)) {
      // If we get here, componentDidMount or componentWillRecieveProps called
      // fetchITF; While we're waiting, show the loading indicator...
      return this.showLoading(
        title,
        'Please wait while we check to see if you have an existing Intent to File.',
        'looking for an intent to file',
      );
    }
    if (itf.fetchCallState === requestStates.failed) {
      // We'll get here after the fetchITF promise is fulfilled
      return (
        <ITFBanner title={title} status="error" featureToggles={featureToggles}>
          {this.props.children}
        </ITFBanner>
      );
    }
    if (itf?.currentITF?.status === itfStatuses.active) {
      const status =
        itf.creationCallState === 'succeeded' ? 'itf-created' : 'itf-found';
      const { expirationDate: currentExpDate } = itf.currentITF;

      if (itf.previousITF) {
        const { expirationDate: prevExpDate } = itf.previousITF;
        // If there was a previous ITF, we created one; show the creation
        // success message
        return (
          <ITFBanner
            title={title}
            status={status}
            previousITF={itf.previousITF}
            currentExpDate={currentExpDate}
            previousExpDate={prevExpDate}
            featureToggles={featureToggles}
          >
            {this.props.children}
          </ITFBanner>
        );
      }

      // Else we fetched an active ITF
      return (
        <ITFBanner
          title={title}
          status={status}
          currentExpDate={currentExpDate}
          featureToggles={featureToggles}
        >
          {this.props.children}
        </ITFBanner>
      );
    }
    if (fetchWaitingStates.includes(itf.creationCallState)) {
      // componentWillRecieveProps called createITF if there was no active ITF
      // found; While we're waiting (again), show the loading indicator...again
      return this.showLoading(
        title,
        'Submitting a new Intent to File...',
        'submitting a new intent to file',
      );
    }

    // We'll get here after the createITF promise is fulfilled and we have no
    // active ITF because of a failed creation call
    return (
      <ITFBanner title={title} status="error" featureToggles={featureToggles}>
        {this.props.children}
      </ITFBanner>
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
  featureToggles: PropTypes.object,
  noITFPages: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  ),
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
