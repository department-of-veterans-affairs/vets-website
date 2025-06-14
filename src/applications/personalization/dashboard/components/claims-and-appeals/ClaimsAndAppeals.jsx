import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import {
  createIsServiceAvailableSelector,
  selectProfile,
} from '~/platform/user/selectors';
import IconCTALink from '../IconCTALink';
import { getAppeals as getAppealsAction } from '../../actions/appeals';
import { getClaims as getClaimsAction } from '../../actions/claims';
import { appealsAvailability } from '../../utils/appeals-helpers';
import { claimsAvailability } from '../../utils/claims-helpers';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import useHighlightedClaimOrAppeal from './hooks/useHighlightedClaimOrAppeal';
import HighlightedClaimAppeal from './HighlightedClaimAppeal';
import DisabilityRatingCard from './DisabilityRatingCard';

const NoClaimsOrAppealsText = () => {
  return (
    <p
      className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
      data-testid="no-outstanding-claims-or-appeals-text"
    >
      You have no claims or appeals to show.
    </p>
  );
};

const ClaimsAndAppealsError = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div
      data-testid="dashboard-section-claims-and-appeals-error"
      className="vads-u-margin-bottom--2p5"
    >
      <va-alert status={status}>
        <h2 slot="headline">
          We can’t access your claims or appeals information
        </h2>
        <div>
          <p>
            We’re sorry. Something went wrong on our end. If you have any claims
            and appeals, you won’t be able to access your claims and appeals
            information right now. Please refresh or try again later.
          </p>
        </div>
      </va-alert>
    </div>
  );
};

const PopularActionsForClaimsAndAppeals = ({ isLOA1 }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showAccreditedRepresentative = useToggleValue(
    TOGGLE_NAMES.representativeStatusEnableV2Features,
  );

  return (
    <>
      <IconCTALink
        text="Learn how to file a claim"
        href="/disability/how-to-file-claim/"
        icon="school"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Learn how to file a claim',
            'links-list-section-header': 'Claims and appeals',
          });
        }}
        testId="file-claims-and-appeals-link"
      />
      {!isLOA1 && (
        <IconCTALink
          text="Manage all claims and appeals"
          href="/claim-or-appeal-status/"
          icon="assignment"
          onClick={() => {
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Manage all claims and appeals',
              'links-list-section-header': 'Claims and appeals',
            });
          }}
        />
      )}
      {showAccreditedRepresentative &&
        !isLOA1 && (
          <IconCTALink
            text="Get help from your accredited representative or VSO"
            href="/profile/accredited-representative/"
            icon="account_circle"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header':
                  'Get help from your accredited representative or VSO',
                'links-list-section-header': 'Claims and appeals',
              });
            }}
          />
        )}
    </>
  );
};

const ClaimsAndAppeals = ({
  appealsData,
  claimsData,
  // for some unit testing purposes, we want to prevent this component from
  // making API calls which kicks off a chain of events that results in the
  // component always showing a loading spinner. I do not like this approach.
  dataLoadingDisabled = false,
  hasAPIError,
  isLOA1,
  getAppeals,
  getClaims,
  shouldLoadAppeals,
  shouldLoadClaims,
  shouldShowLoadingIndicator,
}) => {
  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadAppeals) {
        getAppeals();
      }
    },
    [dataLoadingDisabled, getAppeals, shouldLoadAppeals],
  );

  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadClaims) {
        getClaims();
      }
    },
    [dataLoadingDisabled, getClaims, shouldLoadClaims],
  );

  // the most recently updated open claim or appeal or
  // the latest closed claim or appeal that has been updated in the past 60 days
  const highlightedClaimOrAppeal = useHighlightedClaimOrAppeal(
    appealsData,
    claimsData,
  );

  if (shouldShowLoadingIndicator) {
    return (
      <div
        className="vads-u-margin-y--6"
        data-testid="dashboard-section-claims-and-appeals-loader"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Claims and appeals
        </h2>
        <va-loading-indicator message="Loading claims and appeals..." />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-section-claims-and-appeals">
      <h2>Claims and appeals</h2>
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          {hasAPIError && <ClaimsAndAppealsError />}
          {!hasAPIError && (
            <>
              {highlightedClaimOrAppeal && !isLOA1 ? (
                <HighlightedClaimAppeal
                  claimOrAppeal={highlightedClaimOrAppeal}
                />
              ) : (
                <>
                  {!isLOA1 && <NoClaimsOrAppealsText />}
                  <Toggler
                    toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
                  >
                    <Toggler.Disabled>
                      <PopularActionsForClaimsAndAppeals isLOA1={isLOA1} />
                    </Toggler.Disabled>
                  </Toggler>
                </>
              )}
            </>
          )}
        </DashboardWidgetWrapper>
        {highlightedClaimOrAppeal &&
          !hasAPIError &&
          !isLOA1 && (
            <DashboardWidgetWrapper>
              <Toggler
                toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
              >
                <Toggler.Disabled>
                  <PopularActionsForClaimsAndAppeals />
                </Toggler.Disabled>
              </Toggler>
            </DashboardWidgetWrapper>
          )}
      </div>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Disability rating
          </h3>
          <DashboardWidgetWrapper>
            <DisabilityRatingCard />
          </DashboardWidgetWrapper>
        </Toggler.Enabled>
      </Toggler>
    </div>
  );
};

ClaimsAndAppeals.propTypes = {
  getAppeals: PropTypes.func.isRequired,
  getClaims: PropTypes.func.isRequired,
  hasAPIError: PropTypes.bool.isRequired,
  shouldLoadAppeals: PropTypes.bool.isRequired,
  shouldLoadClaims: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  userFullName: PropTypes.object.isRequired,
  appealsData: PropTypes.arrayOf(PropTypes.object),
  claimsData: PropTypes.arrayOf(PropTypes.object),
  dataLoadingDisabled: PropTypes.bool,
  isLOA1: PropTypes.bool,
};

PopularActionsForClaimsAndAppeals.propTypes = {
  isLOA1: PropTypes.bool,
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.LIGHTHOUSE,
);
const isAppealsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.APPEALS_STATUS,
);

// returns true if claimsAndAppealsRoot.appealsAvailability is set to a value other than
// appealsAvailability.AVAILABLE or appealsAvailability.RECORD_NOT_FOUND_ERROR
const hasAppealsErrorSelector = state => {
  const claimsAndAppealsRoot = state.claims;
  return (
    claimsAndAppealsRoot.appealsAvailability &&
    claimsAndAppealsRoot.appealsAvailability !==
      appealsAvailability.AVAILABLE &&
    claimsAndAppealsRoot.appealsAvailability !==
      appealsAvailability.RECORD_NOT_FOUND_ERROR
  );
};

const mapStateToProps = state => {
  const claimsState = state.claims;
  const { appealsLoading, claimsLoading } = claimsState;
  const hasAppealsError = hasAppealsErrorSelector(state);
  const hasClaimsError =
    claimsState.claimsAvailability === claimsAvailability.UNAVAILABLE;
  const hasAPIError = !!hasAppealsError || !!hasClaimsError;
  const canAccessAppeals = canAccess(state)[API_NAMES.APPEALS] !== undefined;

  return {
    appealsData: claimsState.appeals,
    claimsData: claimsState.claims,
    hasAPIError,
    shouldLoadAppeals: isAppealsAvailableSelector(state) && canAccessAppeals,
    shouldLoadClaims: isClaimsAvailableSelector(state),
    // as soon as we realize there is an error getting either claims or appeals
    // data, stop showing a loading spinner
    shouldShowLoadingIndicator:
      (appealsLoading || claimsLoading) && !hasAPIError,
    userFullName: selectProfile(state).userFullName,
  };
};

const mapDispatchToProps = {
  getAppeals: getAppealsAction,
  getClaims: getClaimsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsAndAppeals);
