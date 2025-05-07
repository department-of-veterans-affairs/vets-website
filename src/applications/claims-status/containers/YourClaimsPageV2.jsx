import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import withRouter from '../utils/withRouter';

import {
  getAppealsV2 as getAppealsV2Action,
  getClaims as getClaimsAction,
  getStemClaims as getStemClaimsAction,
} from '../actions';

import AppealListItem from '../components/appeals-v2/AppealListItem';
import AppealsUnavailable from '../components/AppealsUnavailable';
import NeedHelp from '../components/NeedHelp';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsListItem from '../components/ClaimsListItem';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import FeaturesWarning from '../components/FeaturesWarning';
import NoClaims from '../components/NoClaims';
import StemClaimListItem from '../components/StemClaimListItem';

import { ITEMS_PER_PAGE } from '../constants';

import { getBackendServices } from '../selectors';

import {
  appealsAvailability,
  appealTypes,
  claimsAvailability,
  getVisibleRows,
  getPageRange,
  sortByLastUpdated,
} from '../utils/appeals-v2-helpers';
import { setPageFocus, setUpPage } from '../utils/page';
import { groupClaimsByDocsNeeded, setDocumentTitle } from '../utils/helpers';
import ClaimLetterSection from '../components/claim-letters/ClaimLetterSection';

const getPageFromURL = props =>
  parseInt(new URLSearchParams(props.location.search).get('page'), 10) || 1;

const YourClaimsPageV2 = props => {
  const [page, setPage] = useState(() => getPageFromURL(props));

  useEffect(() => {
    setDocumentTitle('Check your claim, decision review, or appeal status');

    const {
      appealsLoading,
      canAccessAppeals,
      canAccessClaims,
      claimsLoading,
      getAppealsV2,
      getClaims,
      getStemClaims,
      stemClaimsLoading,
    } = props;

    if (canAccessClaims) getClaims();
    if (canAccessAppeals) getAppealsV2();
    getStemClaims();

    if (claimsLoading && appealsLoading && stemClaimsLoading) {
      scrollToTop();
    } else {
      setUpPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      const newPage = getPageFromURL(props);
      setPage(prev => (prev !== newPage ? newPage : prev));
    },
    [props.location.search, props.location.pathname],
  );

  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    [props.location.pathname, props.location.search],
  );

  const changePage = useCallback(
    event => {
      const newURL = `${props.location.pathname}?page=${event.detail.page}`;
      props.navigate(newURL);
      setPage(event.detail.page);
      setPageFocus('#pagination-info');
    },
    [props.location.pathname, props.navigate],
  );

  const renderListItem = claim => {
    if (appealTypes.includes(claim.type)) {
      return (
        <AppealListItem key={claim.id} appeal={claim} name={props.fullName} />
      );
    }
    if (claim.type === 'education_benefits_claims') {
      return <StemClaimListItem key={claim.id} claim={claim} />;
    }
    return <ClaimsListItem key={claim.id} claim={claim} />;
  };

  const renderErrorMessages = () => {
    const {
      claimsLoading,
      appealsLoading,
      stemClaimsLoading,
      appealsAvailable,
      canAccessAppeals,
      canAccessClaims,
      claimsAvailable,
    } = props;

    if (claimsLoading || appealsLoading || stemClaimsLoading) return null;

    if (
      canAccessAppeals &&
      canAccessClaims &&
      claimsAvailable !== claimsAvailability.AVAILABLE &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      return <ClaimsAppealsUnavailable />;
    }
    if (canAccessClaims && claimsAvailable !== claimsAvailability.AVAILABLE) {
      return <ClaimsUnavailable headerLevel={3} />;
    }
    if (
      canAccessAppeals &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      return <AppealsUnavailable />;
    }
    return null;
  };

  const { appealsLoading, claimsLoading, list, stemClaimsLoading } = props;

  const allRequestsLoaded =
    !claimsLoading && !appealsLoading && !stemClaimsLoading;
  const allRequestsLoading =
    claimsLoading && appealsLoading && stemClaimsLoading;
  const atLeastOneRequestLoading =
    claimsLoading || appealsLoading || stemClaimsLoading;
  const emptyList = !(list && list.length);

  let content = null;

  if (allRequestsLoading || (atLeastOneRequestLoading && emptyList)) {
    content = (
      <va-loading-indicator message="Loading your claims and appeals..." />
    );
  } else if (!emptyList) {
    const listLen = list.length;
    const numPages = Math.ceil(listLen / ITEMS_PER_PAGE);
    const shouldPaginate = numPages > 1;

    const pageItems = getVisibleRows(list, page);
    const range = shouldPaginate ? getPageRange(page, listLen) : null;

    content = (
      <>
        {shouldPaginate && (
          <p id="pagination-info">
            {`Showing ${range.start} \u2012 ${range.end} of ${listLen} events`}
          </p>
        )}
        <div className="claim-list">
          {atLeastOneRequestLoading && (
            <va-loading-indicator message="Loading your claims and appeals..." />
          )}
          {pageItems.map(renderListItem)}
          {shouldPaginate && (
            <VaPagination
              page={page}
              pages={numPages}
              onPageSelect={changePage}
            />
          )}
        </div>
      </>
    );
  } else if (allRequestsLoaded) {
    content = <NoClaims />;
  }

  return (
    <>
      <div name="topScrollElement" />
      <article className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs />
          <h1 className="claims-container-title">
            Check your claim, decision review, or appeal status
          </h1>
          <va-on-this-page />
          <h2 id="your-claims-or-appeals" className="vads-u-margin-top--2p5">
            Your claims, decision reviews, or appeals
          </h2>
          <div>{renderErrorMessages()}</div>
          <va-additional-info
            id="claims-combined"
            class="claims-combined"
            trigger="Find out why we sometimes combine claims."
          >
            <div>
              If you turn in a new claim while we’re reviewing another one from
              you, we’ll add any new information to the original claim and close
              the new claim, with no action required from you.
            </div>
          </va-additional-info>
          {content}
          <ClaimLetterSection />
          <FeaturesWarning />
          <h2 id="what-if-i-dont-see-my-appeal">
            What if I can’t find my claim, decision review, or appeal?
          </h2>
          <p>
            If you recently submitted a claim or requested a Higher Level Review
            or Board appeal, we might still be processing it. Check back for
            updates.
          </p>
          <NeedHelp />
        </div>
      </article>
    </>
  );
};

YourClaimsPageV2.propTypes = {
  appealsAvailable: PropTypes.string,
  appealsLoading: PropTypes.bool,
  canAccessAppeals: PropTypes.bool,
  canAccessClaims: PropTypes.bool,
  claimsAvailable: PropTypes.string,
  claimsLoading: PropTypes.bool,
  fullName: PropTypes.shape({}),
  getAppealsV2: PropTypes.func,
  getClaims: PropTypes.func,
  getStemClaims: PropTypes.func,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string,
      attributes: PropTypes.shape({}),
    }),
  ),
  location: PropTypes.object,
  navigate: PropTypes.func,
  stemClaimsLoading: PropTypes.bool,
};

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const claimsV2Root = claimsState.claimsV2;

  const services = getBackendServices(state);
  const canAccessAppeals = services.includes(backendServices.APPEALS_STATUS);
  const canAccessClaims = services.includes(backendServices.LIGHTHOUSE);
  const stemAutomatedDecision = toggleValues(state)[
    FEATURE_FLAG_NAMES.stemAutomatedDecision
  ];

  const stemClaims = stemAutomatedDecision ? claimsV2Root.stemClaims : [];

  const closedClaims = [
    ...claimsV2Root.appeals,
    ...claimsV2Root.claims,
    ...stemClaims,
  ]
    .filter(
      claim =>
        claim.attributes.status === 'COMPLETE' ||
        claim.attributes.claimType === 'STEM',
    )
    .sort(sortByLastUpdated);

  const inProgressClaims = [
    ...claimsV2Root.appeals,
    ...claimsV2Root.claims,
    ...stemClaims,
  ]
    .filter(
      claim =>
        claim.attributes.status !== 'COMPLETE' &&
        claim.attributes.claimType !== 'STEM',
    )
    .sort(sortByLastUpdated);

  const sortedList = [...inProgressClaims, ...closedClaims];

  return {
    appealsAvailable: claimsV2Root.v2Availability,
    appealsLoading: claimsV2Root.appealsLoading,
    canAccessAppeals,
    canAccessClaims,
    claimsAvailable: claimsV2Root.claimsAvailability,
    claimsLoading: claimsV2Root.claimsLoading,
    fullName: state.user.profile.userFullName,
    list: groupClaimsByDocsNeeded(sortedList),
    stemClaimsLoading: claimsV2Root.stemClaimsLoading,
  };
}

const mapDispatchToProps = {
  getAppealsV2: getAppealsV2Action,
  getClaims: getClaimsAction,
  getStemClaims: getStemClaimsAction,
};

// Attach legacy static helpers for tests relying on them
YourClaimsPageV2.getPageFromURL = getPageFromURL;
YourClaimsPageV2.getDerivedStateFromProps = (nextProps, prevState) => {
  const newPage = getPageFromURL(nextProps);
  if (prevState.page !== newPage) {
    return { page: newPage };
  }
  return null;
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(YourClaimsPageV2),
);

export { YourClaimsPageV2 };
