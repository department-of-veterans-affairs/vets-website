import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';

import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

import {
  getLetterListAndBSLOptions,
  profileHasEmptyAddress,
} from '../actions/letters';
import noAddressBanner from '../components/NoAddressBanner';
import systemDownMessage from '../components/systemDownMessage';
import { lettersUseLighthouse, lettersCheckDiscrepancies } from '../selectors';
import { AVAILABILITY_STATUSES } from '../utils/constants';
import {
  recordsNotFound,
  isAddressEmpty,
  // eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
} from '../utils/helpers';

const {
  awaitingResponse,
  available,
  backendServiceError,
  backendAuthenticationError,
  unavailable,
  letterEligibilityError,
  hasEmptyAddress,
} = AVAILABILITY_STATUSES;

export class Main extends React.Component {
  componentDidMount() {
    const { shouldUseLighthouse, shouldUseLettersDiscrepancies } = this.props;

    // eslint-disable-next-line -- LH_MIGRATION
    const LH_MIGRATION__options = LH_MIGRATION__getOptions(shouldUseLighthouse);

    if (!this.props.emptyAddress) {
      // eslint-disable-next-line -- LH_MIGRATION
      return this.props.getLetterListAndBSLOptions(LH_MIGRATION__options, shouldUseLettersDiscrepancies);
    }
    return this.props.profileHasEmptyAddress();
  }

  render() {
    const { lettersAvailability } = this.props;
    const status =
      lettersAvailability === awaitingResponse
        ? awaitingResponse
        : lettersAvailability;
    switch (status) {
      case available:
        return <Outlet />;
      case awaitingResponse:
        return (
          <va-loading-indicator
            message="Loading your letters..."
            uswds="false"
          />
        );
      case backendAuthenticationError:
        return recordsNotFound;
      case letterEligibilityError:
        return <Outlet />;
      case hasEmptyAddress:
        return noAddressBanner;
      case unavailable: // fall-through to default
      case backendServiceError: // fall-through to default
      default:
        return systemDownMessage;
    }
  }
}

Main.propTypes = {
  children: PropTypes.any,
  emptyAddress: PropTypes.bool,
  getLetterListAndBSLOptions: PropTypes.func,
  lettersAvailability: PropTypes.string,
  profileHasEmptyAddress: PropTypes.func,
  shouldUseLettersDiscrepancies: PropTypes.bool,
  shouldUseLighthouse: PropTypes.bool,
};

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
    emptyAddress: isAddressEmpty(selectVAPContactInfo(state)?.mailingAddress),
    shouldUseLettersDiscrepancies: lettersCheckDiscrepancies(state),
    // TODO: change to conform to LH_MIGRATION style
    shouldUseLighthouse: lettersUseLighthouse(state),
  };
}

const mapDispatchToProps = {
  getLetterListAndBSLOptions,
  profileHasEmptyAddress,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
