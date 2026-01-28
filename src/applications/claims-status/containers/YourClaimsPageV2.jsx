import React from 'react';
import { connect } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import withRouter from '../utils/withRouter';

import {
  getAppealsV2 as getAppealsV2Action,
  getClaims as getClaimsAction,
  getStemClaims as getStemClaimsAction,
} from '../actions';

import AppealListItem from '../components/appeals-v2/AppealListItem';
import ClaimCardLoadingSkeleton from '../components/ClaimCard/ClaimCardLoadingSkeleton';
import NeedHelp from '../components/NeedHelp';
import ServiceUnavailableAlert from '../components/ServiceUnavailableAlert';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsListItem from '../components/ClaimsListItem';
import FeaturesWarning from '../components/FeaturesWarning';
import NoClaims from '../components/NoClaims';
import StemClaimListItem from '../components/StemClaimListItem';
import TravelClaimsSection from '../components/TravelClaimsSection';

import { ITEMS_PER_PAGE } from '../constants';

import { getBackendServices } from '../selectors';

import {
  appealsAvailability,
  appealTypes,
  claimsAvailability,
  getVisibleRows,
  getPageRange,
  sortByLastUpdated,
  isClosed,
  isInProgress,
} from '../utils/appeals-v2-helpers';
import { setPageFocus } from '../utils/page';
import { groupClaimsByDocsNeeded, setDocumentTitle } from '../utils/helpers';
import ClaimLetterSection from '../components/claim-letters/ClaimLetterSection';
import { Type2FailureAnalyticsProvider } from '../contexts/Type2FailureAnalyticsContext';

class YourClaimsPageV2 extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);

    this.state = {
      page: YourClaimsPageV2.getPageFromURL(props),
    };
  }

  componentDidMount() {
    setDocumentTitle('Check your claim, decision review, or appeal status');

    const {
      canAccessAppeals,
      canAccessClaims,
      getAppealsV2,
      getClaims,
      getStemClaims,
    } = this.props;

    // Only call if the current user has access to Lighthouse claims
    if (canAccessClaims) {
      getClaims();
    }

    if (canAccessAppeals) {
      getAppealsV2();
    }

    getStemClaims();
    focusElement('h1');
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.search !== this.props.location.search
    ) {
      window.scrollTo(0, 0);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newPage = YourClaimsPageV2.getPageFromURL(nextProps);

    if (newPage !== prevState.page) {
      return {
        page: newPage,
      };
    }
    return null;
  }

  static getPageFromURL(props) {
    const queryParams = new URLSearchParams(props.location.search);
    return parseInt(queryParams.get('page'), 10) || 1;
  }

  changePage(event) {
    const newURL = `${this.props.location.pathname}?page=${event.detail.page}`;
    this.props.navigate(newURL);
    this.setState({ page: event.detail.page });
    // Move focus to "Showing X through Y of Z events..." for screenreaders
    setPageFocus('#pagination-info');
  }

  renderListItem(claim) {
    if (appealTypes.includes(claim.type)) {
      const { fullName } = this.props;

      return <AppealListItem key={claim.id} appeal={claim} name={fullName} />;
    }

    if (claim.type === 'education_benefits_claims') {
      return <StemClaimListItem key={claim.id} claim={claim} />;
    }

    return <ClaimsListItem key={claim.id} claim={claim} />;
  }

  renderErrorMessages() {
    const {
      claimsLoading,
      appealsLoading,
      stemClaimsLoading,
      appealsAvailable,
      canAccessAppeals,
      canAccessClaims,
      claimsAvailable,
      // claimsAuthorized
    } = this.props;

    if (claimsLoading || appealsLoading || stemClaimsLoading) {
      return null;
    }

    // Determine which services are unavailable
    // Service keys must match SERVICE_REGISTRY in constants.js
    const unavailableServices = [];

    if (canAccessClaims && claimsAvailable !== claimsAvailability.AVAILABLE) {
      unavailableServices.push('claims');
    }

    if (
      canAccessAppeals &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      unavailableServices.push('appeals');
    }

    if (unavailableServices.length > 0) {
      return (
        <ServiceUnavailableAlert
          services={unavailableServices}
          headerLevel={3}
        />
      );
    }

    return null;
  }

  render() {
    const {
      appealsLoading,
      claimsLoading,
      list,
      stemClaimsLoading,
    } = this.props;

    let content;
    let pageInfo;
    const allRequestsLoaded =
      !claimsLoading && !appealsLoading && !stemClaimsLoading;
    const emptyList = !(list && list.length);
    // Wait for all requests to complete before rendering results
    // This prevents multiple re-renders as each request completes
    if (!allRequestsLoaded) {
      content = <ClaimCardLoadingSkeleton />;
    } else if (!emptyList) {
      const listLen = list.length;
      const numPages = Math.ceil(listLen / ITEMS_PER_PAGE);
      const shouldPaginate = numPages > 1;

      const pageItems = getVisibleRows(list, this.state.page);

      if (shouldPaginate) {
        const range = getPageRange(this.state.page, listLen);
        const { end, start } = range;

        const txt = `Showing ${start} \u2012 ${end} of ${listLen} events`;

        pageInfo = <p id="pagination-info">{txt}</p>;
      }

      content = (
        <Type2FailureAnalyticsProvider key={this.state.page}>
          {pageInfo}
          <div className="claim-list">
            {pageItems.map(claim => this.renderListItem(claim))}
            <ClaimCardLoadingSkeleton isLoading={false} />
            {shouldPaginate && (
              <VaPagination
                page={this.state.page}
                pages={numPages}
                onPageSelect={this.changePage}
              />
            )}
          </div>
        </Type2FailureAnalyticsProvider>
      );
    } else {
      content = <NoClaims />;
    }

    return (
      <>
        <article className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <div className="breadcrumbs-loading-container">
              <ClaimsBreadcrumbs />
            </div>
            <h1 className="claims-container-title">
              Check your claim, decision review, or appeal status
            </h1>
            <div className="on-this-page-loading-container">
              <va-on-this-page />
            </div>
            <h2 id="your-claims-or-appeals" className="vads-u-margin-top--2p5">
              Your claims, decision reviews, or appeals
            </h2>
            <div>{this.renderErrorMessages()}</div>
            <div className="additional-info-loading-container">
              <va-additional-info
                id="claims-combined"
                class="claims-combined"
                trigger="Find out why we sometimes combine claims"
              >
                <div>
                  If you turn in a new claim while we’re reviewing another one
                  from you, we’ll add any new information to the original claim
                  and close the new claim, with no action required from you.
                </div>
              </va-additional-info>
            </div>
            {content}
            <ClaimLetterSection />
            <h2 id="what-if-i-dont-see-my-appeal">
              What if I can't find my claim, decision review, or appeal?
            </h2>
            <p>
              If you recently submitted a claim or requested a Higher Level
              Review or Board appeal, we might still be processing it. Check
              back for updates.
            </p>
            <TravelClaimsSection />
            <FeaturesWarning />
            <NeedHelp />
          </div>
        </article>
      </>
    );
  }
}

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
  const claimsV2Root = claimsState.claimsV2; // this is where all the meat is for v2

  const services = getBackendServices(state);
  const canAccessAppeals = services.includes(backendServices.APPEALS_STATUS);
  const canAccessClaims = services.includes(backendServices.LIGHTHOUSE);
  const stemAutomatedDecision = toggleValues(state)[
    FEATURE_FLAG_NAMES.stemAutomatedDecision
  ];

  const stemClaims = stemAutomatedDecision ? claimsV2Root.stemClaims : [];

  // TO-DO: Implement with reselect to save cycles
  const closedClaims = [
    ...claimsV2Root.appeals,
    ...claimsV2Root.claims,
    ...stemClaims,
  ]
    .filter(isClosed)
    .sort(sortByLastUpdated);

  const inProgressClaims = [
    ...claimsV2Root.appeals,
    ...claimsV2Root.claims,
    ...stemClaims,
  ]
    .filter(isInProgress)
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(YourClaimsPageV2),
);

export { YourClaimsPageV2 };
