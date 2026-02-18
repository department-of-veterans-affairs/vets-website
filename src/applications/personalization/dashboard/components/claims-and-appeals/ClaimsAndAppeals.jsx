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
    <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
      <Toggler.Disabled>
        <p
          className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
          data-testid="no-outstanding-claims-or-appeals-text"
        >
          You have no claims or appeals to show.
        </p>
      </Toggler.Disabled>
      <Toggler.Enabled>
        <p
          className="vads-u-margin-bottom--1 vads-u-margin-top--neg1"
          data-testid="no-outstanding-claims-or-appeals-text"
        >
          You don’t have any open claims or appeals.
        </p>
      </Toggler.Enabled>
    </Toggler>
  );
};

const ClaimsAndAppealsError = ({ hasAppealsError, hasClaimsError }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const useRedesignContent = useToggleValue(
    TOGGLE_NAMES.myVaAuthExpRedesignEnabled,
  );

  let errorType = 'claims or appeals';
  if (hasAppealsError && !hasClaimsError) {
    errorType = 'appeals';
  } else if (hasClaimsError && !hasAppealsError) {
    errorType = 'claims';
  } else if (hasAppealsError && hasClaimsError) {
    errorType = 'claims and appeals';
  }

  const content = useRedesignContent ? (
    <span data-testId="benefit-application-error-redesign">
      We can’t show some of your {errorType} right now. Refresh this page or try
      again later.
    </span>
  ) : (
    <>
      <h3
        slot="headline"
        className="vads-u-margin-top--0"
        data-testId="benefit-application-error-original"
      >
        We can’t access your {errorType} information
      </h3>
      <p className="vads-u-margin-bottom--0">
        We’re sorry. Something went wrong on our end. If you have any{' '}
        {errorType}, you won’t be able to access your {errorType} information
        right now. Please refresh or try again later.
      </p>
    </>
  );
  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div
      data-testid="dashboard-section-claims-and-appeals-error"
      className="vads-u-margin-bottom--2p5"
    >
      <va-alert status={status}>{content}</va-alert>
    </div>
  );
};

ClaimsAndAppealsError.propTypes = {
  hasAppealsError: PropTypes.bool,
  hasClaimsError: PropTypes.bool,
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
          href="/track-claims/your-claims/"
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
  hasAPIError,
  hasAppealsError,
  hasClaimsError,
  isLOA1,
  shouldShowLoadingIndicator,
}) => {
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
          {hasAPIError && (
            <ClaimsAndAppealsError
              hasAppealsError={hasAppealsError}
              hasClaimsError={hasClaimsError}
            />
          )}
          <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
            <Toggler.Disabled>
              {(() => {
                if (isLOA1) {
                  return null;
                }
                if (highlightedClaimOrAppeal) {
                  return (
                    <HighlightedClaimAppeal
                      claimOrAppeal={highlightedClaimOrAppeal}
                    />
                  );
                }
                if (!hasAPIError) {
                  return <NoClaimsOrAppealsText />;
                }
                return null;
              })()}
            </Toggler.Disabled>
            <Toggler.Enabled>
              {highlightedClaimOrAppeal && !isLOA1 ? (
                <HighlightedClaimAppeal
                  claimOrAppeal={highlightedClaimOrAppeal}
                />
              ) : (
                !hasAPIError && <NoClaimsOrAppealsText />
              )}
            </Toggler.Enabled>
          </Toggler>
          <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
            <Toggler.Disabled>
              <PopularActionsForClaimsAndAppeals isLOA1={isLOA1} />
            </Toggler.Disabled>
          </Toggler>
        </DashboardWidgetWrapper>
      </div>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <div>
            <va-link
              href="/track-claims/your-claims"
              text="Check claims and appeals"
            />
          </div>
          {!isLOA1 && (
            <DashboardWidgetWrapper>
              <DisabilityRatingCard />
            </DashboardWidgetWrapper>
          )}
        </Toggler.Enabled>
      </Toggler>
    </div>
  );
};

ClaimsAndAppeals.propTypes = {
  getAppeals: PropTypes.func.isRequired,
  getClaims: PropTypes.func.isRequired,
  hasAPIError: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  userFullName: PropTypes.object.isRequired,
  appealsData: PropTypes.arrayOf(PropTypes.object),
  claimsData: PropTypes.arrayOf(PropTypes.object),
  hasAppealsError: PropTypes.bool,
  hasClaimsError: PropTypes.bool,
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
    hasAppealsError,
    hasClaimsError,
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
