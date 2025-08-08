import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';

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
    switch (this.props.downloadStatus) {
      case DOWNLOAD_STATUSES.downloading:
        buttonText = 'Downloading...';
        buttonDisabled = true;
        break;
      case DOWNLOAD_STATUSES.success:
        buttonText = `${this.props.letterTitle} (PDF)`;
        buttonDisabled = undefined;
        message = (
          <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
            {toggleValue =>
              toggleValue ? (
                <va-alert
                  status="success"
                  class="vads-u-margin-bottom--4"
                  role="alert"
                >
                  <h4 slot="headline">You’ve downloaded your benefit letter</h4>
                  <p>
                    {getDownloadSuccessMessage(
                      this.benefitSummaryOptionsLength,
                    )}
                  </p>
                  <p>
                    If you want to create a new letter with different
                    information, update your selections and download your letter
                    again.
                  </p>
                </va-alert>
              ) : (
                <va-alert status="success" role="alert">
                  <h4 slot="headline">
                    Your letter has successfully downloaded.
                  </h4>
                  <p>
                    If you want to download your letter again, please press the
                    button below.
                  </p>
                </va-alert>
              )
            }
          </Toggler.Hoc>
        );
        break;
      case DOWNLOAD_STATUSES.failure:
        buttonText = 'Retry download';
        buttonDisabled = undefined;
        message = (
          <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
            {toggleValue =>
              toggleValue ? (
                <va-alert
                  status="error"
                  class="vads-u-margin-bottom--4"
                  role="alert"
                >
                  <h4 slot="headline">
                    Your VA Benefit Summary Letter didn't download
                  </h4>
                  <p>
                    Your letter isn’t available at this time. If you need help
                    with accessing your letter, please <CallVBACenter />
                  </p>
                </va-alert>
              ) : (
                <va-alert status="error" role="alert">
                  <h4 slot="headline">Your letter didn’t download.</h4>
                  <p>
                    Your letter isn’t available at this time. If you need help
                    with accessing your letter, please <CallVBACenter />
                  </p>
                </va-alert>
              )
            }
          </Toggler.Hoc>
        );
        break;
      default:
        buttonText = `${this.props.letterTitle} (PDF)`;
        buttonDisabled = undefined;
    }

    return (
      <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
        {toggleValue =>
          toggleValue ? (
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
              <VaButton
                className="vads-u-margin-y--0"
                disabled={buttonDisabled}
                text={buttonText}
                onClick={this.downloadLetter}
              />
            </div>
          ) : (
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
              <VaButton
                className="vads-u-margin-top--1 vads-u-margin-bottom--3"
                disabled={buttonDisabled}
                text={buttonText}
                onClick={this.downloadLetter}
              />
            </div>
          )
        }
      </Toggler.Hoc>
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
  getLetterPdf: PropTypes.func.isRequired,
  letterOptions: PropTypes.object.isRequired,
  letterTitle: PropTypes.string.isRequired,
  letterType: PropTypes.string.isRequired,
  downloadStatus: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  getLetterPdf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DownloadLetterLink);
