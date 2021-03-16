import React from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';

import {
  itfMessage,
  itfError,
  itfSuccess,
  itfActive,
} from '../content/itfWrapper';

export default class ITFBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messageDismissed: false };
  }

  dismissMessage = () => {
    this.setState({ messageDismissed: true });
  };

  render() {
    if (this.state.messageDismissed) {
      return this.props.children;
    }

    let message;
    switch (this.props.status) {
      case 'error':
        message = itfMessage(
          'We’re sorry. Something went wrong on our end.',
          itfError,
          'error',
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
          {this.props.status !== 'error' && (
            <button
              className="usa-button-primary"
              onClick={this.dismissMessage}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }
}

ITFBanner.propTypes = {
  status: PropTypes.oneOf(['error', 'itf-found', 'itf-created']).isRequired,
  title: PropTypes.string,
  previousITF: PropTypes.object,
  currentExpDate: PropTypes.string,
  previousExpDate: PropTypes.string,
};
