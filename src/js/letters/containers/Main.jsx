import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import { systemDownMessage } from '../../common/utils/error-messages';
import { AVAILABILITY_STATUSES } from '../utils/constants';
import { recordsNotFound } from '../utils/helpers';

import {
  getLetterListAndBSLOptions,
  getMailingAddress,
  getAddressCountries,
  getAddressStates
} from '../actions/letters';

const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  invalidAddressProperty,
  unavailable,
  letterEligibilityError
} = AVAILABILITY_STATUSES;

export class Main extends React.Component {
  componentDidMount() {
    this.props.getLetterListAndBSLOptions();
    this.props.getMailingAddress();
    this.props.getAddressCountries();
    this.props.getAddressStates();
  }


  appAvailability(lettersAvailability, addressAvailability) {
    // If letters are available, but address is still awaiting response, consider the entire app to still be awaiting response
    if (lettersAvailability === awaitingResponse || addressAvailability === awaitingResponse) {
      return awaitingResponse;
    }

    // If address isn't available, take the whole system down
    if (addressAvailability === unavailable) {
      return backendServiceError;
    }

    return lettersAvailability;
  }

  render() {
    let appContent;

    switch (this.appAvailability(this.props.lettersAvailability, this.props.addressAvailability)) {
      case available:
        appContent = this.props.children;
        break;
      case awaitingResponse:
        appContent = <LoadingIndicator message="Loading your letters..."/>;
        break;
      case backendServiceError:
        appContent = systemDownMessage;
        break;
      case backendAuthenticationError:
        appContent = recordsNotFound;
        break;
      case invalidAddressProperty:
        appContent = systemDownMessage;
        break;
      case letterEligibilityError:
        appContent = this.props.children;
        break;
      case unavailable:
        appContent = (
          <div id="lettersUnavailable">
            <div className="usa-alert usa-alert-error" role="alert">
              <div className="usa-alert-body">
                <h4 className="usa-alert-heading">Letters Unavailable</h4>
                <p className="usa-alert-text">
                  We weren’t able to retrieve your VA letters. Please call <a href="tel:855-574-7286">1-855-574-7286</a>,
                  TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
                </p>
              </div>
            </div>
            <br/>
          </div>
        );
        break;
      default:
        appContent = systemDownMessage;
    }

    return (
      <div>
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    address: letterState.address,
    addressAvailability: letterState.addressAvailability,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable
  };
}

const mapDispatchToProps = {
  // getBenefitSummaryOptions,
  // getLetterList,
  getLetterListAndBSLOptions,
  getMailingAddress,
  getAddressCountries,
  getAddressStates,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
