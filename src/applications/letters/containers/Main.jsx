import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import { systemDownMessage } from '../../../platform/static-data/error-messages';
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
      return unavailable;
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
      case backendAuthenticationError:
        appContent = recordsNotFound;
        break;
      case letterEligibilityError:
        appContent = this.props.children;
        break;
      case unavailable: {
        appContent = (
          <div id="maintenance-mode">
            <h2>The VA letters tool is down for maintenance</h2>
            <p>We're doing some work on the VA letters tool on May 16, 2018, between 7:00 p.m and 8:00 p.m. (ET). If you're having trouble using this tool during this time, please check back again later.</p>
          </div>
        );
        break;
      }
      case backendServiceError: // fall-through to default
      case invalidAddressProperty: // fall-through to default
      default:
        appContent = systemDownMessage;
        break;
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
