import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';

import { getLetterPdf } from '../actions/letters';
import { DOWNLOAD_STATUSES } from '../utils/constants';

export class DownloadLetterLink extends React.Component {
  // Either download the pdf or open it in a new window, depending on the
  // browser. Needs to be manually tested on a variety of
  // vets.gov-supported platforms, particularly iOS/Safari
  downloadLetter = e => {
    e.preventDefault();
    recordEvent({
      event: 'letter-download',
      'letter-type': this.props.letterType,
    });
    this.props.getLetterPdf(
      this.props.letterType,
      this.props.letterName,
      this.props.letterOptions,
      this.props.LH_MIGRATION__options,
    );
  };

  render() {
    let buttonClasses;
    let buttonText;
    let buttonDisabled;
    let message;
    switch (this.props.downloadStatus) {
      case DOWNLOAD_STATUSES.downloading:
        buttonClasses = 'usa-button-disabled';
        buttonText = 'Downloading...';
        buttonDisabled = true;
        break;
      case DOWNLOAD_STATUSES.success:
        buttonClasses = 'usa-button-primary';
        buttonText = 'Download letter';
        buttonDisabled = false;
        message = (
          <va-alert status="success" role="alert">
            <h4 slot="headline">Your letter has successfully downloaded.</h4>
            <p>
              If you want to download your letter again, please press the button
              below.
            </p>
          </va-alert>
        );
        break;
      case DOWNLOAD_STATUSES.failure:
        buttonClasses = 'usa-button-primary';
        buttonText = 'Retry download';
        buttonDisabled = false;
        message = (
          <va-alert status="error" role="alert">
            <h4 slot="headline">Your letter didn’t download.</h4>
            <p>
              Your letter isn’t available at this time. If you need help with
              accessing your letter, please <CallVBACenter />
            </p>
          </va-alert>
        );
        break;
      default:
        buttonClasses = 'usa-button-primary';
        buttonText = 'Download letter';
        buttonDisabled = false;
    }

    return (
      <div>
        <div className="form-expanding-group form-expanding-group-open">
          <TransitionGroup>
            {message ? (
              <CSSTransition
                classNames="form-expanding-group-inner"
                appear
                timeout={{
                  appear: 700,
                  enter: 700,
                }}
                exit={false}
              >
                {message}
              </CSSTransition>
            ) : null}
          </TransitionGroup>
        </div>
        <div className="download-button">
          <button
            type="button"
            onClick={this.downloadLetter}
            disabled={buttonDisabled}
            className={buttonClasses}
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    letterType: ownProps.letterType,
    letterName: ownProps.letterName,
    downloadStatus: ownProps.downloadStatus,
    letterOptions: state.letters.requestOptions,
    shouldUseLighthouse: state.shouldUseLighthouse,
  };
}

DownloadLetterLink.propTypes = {
  letterName: PropTypes.string.isRequired,
  letterType: PropTypes.string.isRequired,
  downloadStatus: PropTypes.string,
};

const mapDispatchToProps = {
  getLetterPdf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadLetterLink);
