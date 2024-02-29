import React from 'react';
import { connect } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import {
  getAppealsV2 as getAppealsV2Action,
  getClaims as getClaimsAction,
  getStemClaims as getStemClaimsAction,
} from '../actions';

import AppealListItem from '../components/appeals-v2/AppealListItemV3';
import AppealsUnavailable from '../components/AppealsUnavailable';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimsListItem from '../components/ClaimsListItemV3';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClosedClaimMessage from '../components/ClosedClaimMessage';
import FeaturesWarning from '../components/FeaturesWarning';
import NoClaims from '../components/NoClaims';
import StemClaimListItem from '../components/StemClaimListItemV3';

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
import { groupClaimsByDocsNeeded } from '../utils/helpers';

class YourClaimsPageV2 extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.hide30DayNotice = this.hide30DayNotice.bind(this);

    if (!sessionStorage.getItem('show30DayNotice')) {
      sessionStorage.setItem('show30DayNotice', true);
    }

    this.state = {
      page: 1,
      show30DayNotice: sessionStorage.getItem('show30DayNotice') === 'true',
    };
  }

  componentDidMount() {
    document.title =
      'Check your claim, decision review, or appeal status | Veterans Affairs';

    const {
      appealsLoading,
      canAccessAppeals,
      canAccessClaims,
      claimsLoading,
      getAppealsV2,
      getClaims,
      getStemClaims,
      stemClaimsLoading,
    } = this.props;

    // Only call if the current user has access to Lighthouse claims
    if (canAccessClaims) {
      getClaims();
    }

    if (canAccessAppeals) {
      getAppealsV2();
    }

    getStemClaims();

    if (claimsLoading && appealsLoading && stemClaimsLoading) {
      scrollToTop();
    } else {
      setUpPage();
    }
  }

  changePage(event) {
    this.setState({ page: event.detail.page });
    // Move focus to "Showing X through Y of Z events..." for screenreaders
    setPageFocus('#pagination-info');
  }

  hide30DayNotice() {
    this.setState({ show30DayNotice: false });
    sessionStorage.setItem('show30DayNotice', false);
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

    if (
      canAccessAppeals &&
      canAccessClaims &&
      claimsAvailable !== claimsAvailability.AVAILABLE &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      return <ClaimsAppealsUnavailable />;
    }

    if (canAccessClaims && claimsAvailable !== claimsAvailability.AVAILABLE) {
      return <ClaimsUnavailable />;
    }

    if (
      canAccessAppeals &&
      appealsAvailable !== appealsAvailability.AVAILABLE
    ) {
      return <AppealsUnavailable />;
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
    const allRequestsLoading =
      claimsLoading && appealsLoading && stemClaimsLoading;
    const atLeastOneRequestLoading =
      claimsLoading || appealsLoading || stemClaimsLoading;
    const emptyList = !(list && list.length);
    if (allRequestsLoading || (atLeastOneRequestLoading && emptyList)) {
      content = (
        <va-loading-indicator
          message="Loading your claims and appeals..."
          uswds="false"
        />
      );
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
        <>
          {this.state.show30DayNotice && (
            <ClosedClaimMessage
              claims={pageItems}
              onClose={this.hide30DayNotice}
            />
          )}
          {pageInfo}
          <div className="claim-list">
            {atLeastOneRequestLoading && (
              <va-loading-indicator
                message="Loading your claims and appeals..."
                uswds="false"
              />
            )}
            {pageItems.map(claim => this.renderListItem(claim))}
            {shouldPaginate && (
              <VaPagination
                uswds="false"
                page={this.state.page}
                pages={numPages}
                onPageSelect={this.changePage}
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
            <va-on-this-page uswds="false" />
            <h2 id="your-claims-or-appeals" className="vads-u-margin-top--2p5">
              Your claims, decision reviews, or appeals
            </h2>
            <div>{this.renderErrorMessages()}</div>
            <va-additional-info
              id="claims-combined"
              class="claims-combined"
              trigger="Find out why we sometimes combine claims."
              uswds="false"
            >
              <div>
                If you turn in a new claim while we’re reviewing another one
                from you, we’ll add any new information to the original claim
                and close the new claim, with no action required from you.
              </div>
            </va-additional-info>
            {content}
            <FeaturesWarning />
            <h2 id="what-if-i-dont-see-my-appeal">
              What if I don’t see my appeal?
            </h2>
            <p>
              If you submitted a Notice of Disagreement for an appeal within the
              last 3 months, VA might still be processing your appeal. For more
              information, contact your Veterans Service Organization or
              representative.
            </p>
            <AskVAQuestions />
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
  const sortedList = [
    ...claimsV2Root.appeals,
    ...claimsV2Root.claims,
    ...stemClaims,
  ].sort(sortByLastUpdated);

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
    synced: claimsState.claimSync.synced,
  };
}

const mapDispatchToProps = {
  getAppealsV2: getAppealsV2Action,
  getClaims: getClaimsAction,
  getStemClaims: getStemClaimsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YourClaimsPageV2);

export { YourClaimsPageV2 };
