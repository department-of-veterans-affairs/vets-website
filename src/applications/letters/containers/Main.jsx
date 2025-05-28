import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom-v5-compat';
import { Toggler } from 'platform/utilities/feature-toggles';

import { selectVAPContactInfo } from '@department-of-veterans-affairs/platform-user/selectors';

import {
  getLetterListAndBSLOptions,
  profileHasEmptyAddress,
} from '../actions/letters';
import NoAddressBanner from '../components/NoAddressBanner';
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
      return this.props.getLetterListAndBSLOptions(
        LH_MIGRATION__options,
        shouldUseLettersDiscrepancies,
      );
    }
    return this.props.profileHasEmptyAddress();
  }

  render() {
    const { lettersAvailability } = this.props;
    const status =
      lettersAvailability === awaitingResponse
        ? awaitingResponse
        : lettersAvailability;
    let content;
    switch (status) {
      case available:
        content = <Outlet />;
        break;
      case awaitingResponse:
        content = <va-loading-indicator message="Loading your letters..." />;
        break;
      case backendAuthenticationError:
        content = recordsNotFound;
        break;
      case letterEligibilityError:
        content = <Outlet />;
        break;
      case hasEmptyAddress:
        content = <NoAddressBanner />;
        break;
      case unavailable: // fall-through to default
      case backendServiceError: // fall-through to default
      default:
        content = systemDownMessage;
    }
    return (
      <div>
        {content}

        <Toggler.Hoc toggleName={Toggler.TOGGLE_NAMES.lettersPageNewDesign}>
          {toggleValue =>
            toggleValue ? (
              <>
                <h2 slot="headline">
                  Other sources of VA benefit documentation
                </h2>
                <p>
                  A lot of people come to this page looking for their Post-9/11
                  GI Bill statement of benefits, their Certificate of
                  Eligibility (COE) for home loan benefits, and their DD214. We
                  don’t have these documents available here yet, but if you’re
                  eligible for them, you can get them through these links:
                </p>
                <ul className="vads-u-margin-bottom--9 bullet-disc">
                  <li>
                    <a
                      href="/education/download-letters/"
                      target="_blank"
                      className="vads-u-text-decoration--none"
                    >
                      VA education letters
                    </a>
                  </li>
                  <li>
                    <a
                      href="/education/gi-bill/post-9-11/ch-33-benefit"
                      target="_blank"
                      className="vads-u-text-decoration--none"
                    >
                      Post-9/11 GI Bill statement of benefits
                    </a>
                  </li>
                  <li>
                    <a
                      href="/housing-assistance/home-loans/check-coe-status/"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="vads-u-text-decoration--none"
                    >
                      Certificate of home loan benefits
                    </a>
                  </li>
                  <li>
                    <a
                      href="/records/get-military-service-records/"
                      rel="noopener noreferrer"
                      target="_blank"
                      className="vads-u-text-decoration--none"
                    >
                      Discharge or separation papers (DD214)
                    </a>
                  </li>
                </ul>
                <va-need-help>
                  <div slot="content">
                    <p>
                      Call us at <va-telephone contact="8008271000" />. We're
                      here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If
                      you have hearing loss, call{' '}
                      <va-telephone contact="711" tty="true" />.
                    </p>
                  </div>
                </va-need-help>
              </>
            ) : null
          }
        </Toggler.Hoc>
      </div>
    );
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
