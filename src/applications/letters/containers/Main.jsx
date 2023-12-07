import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectVAPContactInfo } from 'platform/user/selectors';
import { AVAILABILITY_STATUSES } from '../utils/constants';
import {
  recordsNotFound,
  isAddressEmpty,
  // eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getOptions,
} from '../utils/helpers';
import noAddressBanner from '../components/NoAddressBanner';
import systemDownMessage from '../components/systemDownMessage';

import {
  getLetterListAndBSLOptions,
  profileHasEmptyAddress,
} from '../actions/letters';

import { lettersUseLighthouse } from '../selectors';

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
    const { useLighthouse } = this.props;

    // eslint-disable-next-line -- LH_MIGRATION
    const LH_MIGRATION__options = LH_MIGRATION__getOptions(useLighthouse);

    if (!this.props.emptyAddress) {
      // eslint-disable-next-line -- LH_MIGRATION
      return this.props.getLetterListAndBSLOptions(LH_MIGRATION__options);
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
        return this.props.children;
      case awaitingResponse:
        return <va-loading-indicator message="Loading your letters..." />;
      case backendAuthenticationError:
        return recordsNotFound;
      case letterEligibilityError:
        return this.props.children;
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
  useLighthouse: PropTypes.bool,
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
    // START lighthouse_migration
    useLighthouse: lettersUseLighthouse(state),
    // END lighthouse_migration
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
