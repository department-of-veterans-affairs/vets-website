import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { focusElement } from 'platform/utilities/ui';
import { dismissITFMessage as dismissITFMessageAction } from '../actions';
import { trackFormResumption } from '../utils/datadogRumTracking';
import {
  TRACKING_FORM_RESUMPTION,
  DISABILITY_526_V2_ROOT_URL,
} from '../constants';

import {
  itfMessage,
  itfError,
  itfSuccess,
  itfActive,
} from '../content/itfWrapper';

export class ITFBanner extends React.Component {
  componentDidUpdate(prevProps) {
    // Track form resumption when ITF banner is dismissed
    if (!prevProps.messageDismissed && this.props.messageDismissed) {
      try {
        const alreadyTracked =
          sessionStorage.getItem(TRACKING_FORM_RESUMPTION) === 'true';

        if (!alreadyTracked) {
          trackFormResumption({
            featureToggles: this.props.featureToggles || {},
            returnUrl: window.location.pathname,
          });
          sessionStorage.setItem(TRACKING_FORM_RESUMPTION, 'true');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Form Resumption Tracking Error]', error);
      }
    }
  }

  dismissMessage = () => {
    this.props.dismissITFMessage();
  };

  render() {
    if (this.props.messageDismissed) {
      return this.props.children;
    }

    let message;
    switch (this.props.status) {
      case 'error':
        message = itfMessage(
          'We can’t confirm if we have an intent to file on record for you right now',
          itfError,
          'info',
        );
        break;
      case 'itf-found':
        message = itfMessage(
          'You already have an Intent to File',
          itfActive(this.props.currentExpDate),
          'success',
        );
        break;
      case 'itf-created': {
        const { previousITF, currentExpDate, previousExpDate } = this.props;
        message = itfMessage(
          'Your Intent to File request has been submitted',
          itfSuccess(previousITF, currentExpDate, previousExpDate),
          'success',
        );
        break;
      }
      default:
        throw new Error(
          `Unexpected status prop in ITFBanner: ${this.props.status}`,
        );
    }

    setTimeout(() => {
      focusElement('.itf-wrapper');
    });

    return (
      <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
        <div className="usa-content">
          <h1>{this.props.title}</h1>
          {message}
          <Link
            className="vads-u-margin-right--2"
            to={DISABILITY_526_V2_ROOT_URL}
          >
            Back
          </Link>
          <button
            type="button"
            className="usa-button-primary"
            onClick={this.dismissMessage}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
}

ITFBanner.propTypes = {
  status: PropTypes.oneOf(['error', 'itf-found', 'itf-created']).isRequired,
  children: PropTypes.node,
  currentExpDate: PropTypes.string,
  dismissITFMessage: PropTypes.func,
  featureToggles: PropTypes.object,
  messageDismissed: PropTypes.bool,
  previousExpDate: PropTypes.string,
  previousITF: PropTypes.object,
  title: PropTypes.string,
};

const mapStateToProps = state => ({
  messageDismissed: state.itf.messageDismissed,
});

const mapDispatchToProps = {
  dismissITFMessage: dismissITFMessageAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ITFBanner);
