import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import {
  VaButton,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getLetterPdf } from '../actions/letters';
import { DOWNLOAD_STATUSES } from '../utils/constants';
import { getDownloadSuccessMessage } from '../utils/helpers';

export class DownloadLetterLink extends React.Component {
  benefitSummaryOptionsLength = 0;

  // Either download the pdf or open it in a new window, depending on the
  // browser. Needs to be manually tested on a variety of
  // vets.gov-supported platforms, particularly iOS/Safari
  downloadLetter = e => {
    e.preventDefault();

    const benefitSummaryOptionList = document.getElementById('va-bsl-options');
    if (benefitSummaryOptionList) {
      // TODO: when the feature flag for the new design is removed, the
      // input[type="checkbox"]:checked selector can be removed as well
      const checkedInputs = benefitSummaryOptionList.querySelectorAll(
        'input[type="checkbox"]:checked, va-checkbox[checked="true"]',
      );
      this.benefitSummaryOptionsLength = checkedInputs.length;
    }

    recordEvent({
      event: 'letter-download',
      'letter-type': this.props.letterType,
    });

    this.props.getLetterPdf(
      this.props.letterType,
      this.props.letterTitle,
      this.props.letterOptions,
      this.props.LH_MIGRATION__options,
    );
  };

  render() {
    let buttonText;
    let buttonDisabled; // false causes MS Voice Access to ignore buttons
    let message;
    let showLoadingIndicator = false;
    switch (this.props.downloadStatus) {
      case DOWNLOAD_STATUSES.downloading:
        showLoadingIndicator = true;
        break;
      case DOWNLOAD_STATUSES.success:
        buttonText = `${this.props.letterTitle} (PDF)`;
        buttonDisabled = undefined;
        message = (
          <va-alert
            status="success"
            class="vads-u-margin-bottom--4"
            role="alert"
          >
            <h4 slot="headline">You downloaded your benefit letter</h4>
            <p>{getDownloadSuccessMessage(this.benefitSummaryOptionsLength)}</p>
            <p>
              If you want to create a new letter with different information,
              select different topics and download your letter again.
            </p>
          </va-alert>
        );
        break;
      case DOWNLOAD_STATUSES.failure:
        buttonText = 'Retry download';
        buttonDisabled = undefined;
        message = (
          <va-alert status="error" class="vads-u-margin-bottom--4" role="alert">
            <h4 slot="headline">
              Your VA Benefit Summary Letter didn't download
            </h4>
            <p>
              Your letter isn’t available at this time. If you need help with
              accessing your letter, please <CallVBACenter />
            </p>
          </va-alert>
        );
        break;
      default:
        buttonText = `${this.props.letterTitle} (PDF)`;
        buttonDisabled = undefined;
    }

    return (
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
        {showLoadingIndicator ? (
          <VaLoadingIndicator message="Downloading your letter…" set-focus />
        ) : (
          <VaButton
            className="vads-u-margin-y--0"
            disabled={buttonDisabled}
            text={buttonText}
            onClick={this.downloadLetter}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    letterType: ownProps.letterType,
    letterTitle: ownProps.letterTitle,
    downloadStatus: ownProps.downloadStatus,
    letterOptions: state.letters.requestOptions,
    shouldUseLighthouse: state.shouldUseLighthouse,
  };
}

DownloadLetterLink.propTypes = {
  // eslint-disable-next-line camelcase
  LH_MIGRATION__options: PropTypes.object.isRequired,
  downloadStatus: PropTypes.string.isRequired,
  getLetterPdf: PropTypes.func.isRequired,
  letterOptions: PropTypes.object.isRequired,
  letterTitle: PropTypes.string.isRequired,
  letterType: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  getLetterPdf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadLetterLink);
