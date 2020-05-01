import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { systemDownMessage } from 'platform/static-data/error-messages';
import { AVAILABILITY_STATUSES } from '../utils/constants';
import { recordsNotFound, isAddressEmpty } from '../utils/helpers';

import { getLetterListAndBSLOptions } from '../actions/letters';

const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  unavailable,
  letterEligibilityError,
} = AVAILABILITY_STATUSES;

export class Main extends React.Component {
  componentDidMount() {
    if (!this.props.emptyAddress) {
      this.props.getLetterListAndBSLOptions();
    }
  }

  appAvailability(lettersAvailability) {
    if (lettersAvailability === awaitingResponse) {
      return awaitingResponse;
    }

    return lettersAvailability;
  }

  render() {
    let appContent;

    switch (this.appAvailability(this.props.lettersAvailability)) {
      case available:
        appContent = this.props.children;
        break;
      case awaitingResponse:
        appContent = <LoadingIndicator message="Loading your letters..." />;
        break;
      case backendAuthenticationError:
        appContent = recordsNotFound;
        break;
      case letterEligibilityError:
        appContent = this.props.children;
        break;
      case unavailable: // fall-through to default
      case backendServiceError: // fall-through to default
      default:
        appContent = systemDownMessage;
        break;
    }

    return <div>{appContent}</div>;
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    letters: letterState.letters,
    lettersAvailability: letterState.lettersAvailability,
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo,
    },
    optionsAvailable: letterState.optionsAvailable,
    emptyAddress: isAddressEmpty(state.user.profile.vet360.mailingAddress),
  };
}

const mapDispatchToProps = {
  // getBenefitSummaryOptions,
  // getLetterList,
  getLetterListAndBSLOptions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
