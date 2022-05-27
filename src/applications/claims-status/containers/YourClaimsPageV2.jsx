import React from 'react';
import { connect } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import backendServices from 'platform/user/profile/constants/backendServices';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  changePageV2 as changePageV2Action,
  getAppealsV2 as getAppealsV2Action,
  getClaimsV2 as getClaimsV2Action,
  getStemClaims as getStemClaimsAction,
  hide30DayNotice as hide30DayNoticeAction,
  sortClaims as sortClaimsAction,
} from '../actions/index';
import {
  appealTypes,
  claimsAvailability,
  appealsAvailability,
  sortByLastUpdated,
  getVisibleRows,
  getPageRange,
} from '../utils/appeals-v2-helpers';
import { setUpPage, setPageFocus } from '../utils/page';

import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import AppealsUnavailable from '../components/AppealsUnavailable';
import AskVAQuestions from '../components/AskVAQuestions';
import { consolidatedClaimsContent } from '../components/ConsolidatedClaims';
import FeaturesWarning from '../components/FeaturesWarning';
import ClaimsListItem from '../components/appeals-v2/ClaimsListItemV2';
import AppealListItem from '../components/appeals-v2/AppealListItemV2';
import NoClaims from '../components/NoClaims';
import ClosedClaimMessage from '../components/ClosedClaimMessage';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import StemClaimListItem from '../components/StemClaimListItem';
import MobileAppMessage from '../components/MobileAppMessage';

class YourClaimsPageV2 extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    document.title = 'Check your claim or appeal status | Veterans Affairs';

    const {
      canAccessAppeals,
      canAccessClaims,
      getAppealsV2,
      getClaimsV2,
      getStemClaims,
      claimsLoading,
      appealsLoading,
      stemClaimsLoading,
    } = this.props;
    if (canAccessClaims) {
      getClaimsV2();
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

  // componentWillReceiveProps(newProps) {
  // an initial sort needs to happen in componentDidMount
  // }

  changePage(event) {
    const { changePageV2 } = this.props;
    changePageV2(event.detail.page);
    // Move focus to "Showing X through Y of Z events..." for screenreaders
    setPageFocus('#pagination-info');
  }

  renderListItem(claim) {
    if (appealTypes.includes(claim.type)) {
      const { fullName } = this.props;
      return <AppealListItem key={claim.id} appeal={claim} name={fullName} />;
    }

    if (claim.type === 'education_benefits_claims') {
      return <StemClaimListItem claim={claim} key={claim.id} />;
    }

    return <ClaimsListItem claim={claim} key={claim.id} />;
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
      list,
      listLength,
      pages,
      page,
      claimsLoading,
      appealsLoading,
      stemClaimsLoading,
      show30DayNotice,
      hide30DayNotice,
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
          set-focus
        />
      );
    } else {
      if (!emptyList) {
        pageInfo = null;
        if (pages > 1) {
          const range = getPageRange(page, listLength);
          pageInfo = (
            <p id="pagination-info">
              {`Showing ${range.start} \u2012 ${
                range.end
              } of ${listLength} events`}
            </p>
          );
        }
        content = (
          <div>
            {show30DayNotice && (
              <ClosedClaimMessage claims={list} onClose={hide30DayNotice} />
            )}
            {pageInfo}
            <div className="claim-list">
              {atLeastOneRequestLoading && (
                <va-loading-indicator message="Loading your claims and appeals..." />
              )}
              {list.map(claim => this.renderListItem(claim))}
              <VaPagination
                page={page}
                pages={pages}
                onPageSelect={this.changePage}
              />
            </div>
          </div>
        );
      } else if (allRequestsLoaded) {
        content = <NoClaims />;
      }
      content = <div className="va-tab-content">{content}</div>;
    }

    return (
      <div>
        <div name="topScrollElement" />
        <article className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <ClaimsBreadcrumbs />
            <h1 className="claims-container-title">
              Check your claim or appeal status
            </h1>
            <va-on-this-page className="vads-u-margin-top--0" />
            <MobileAppMessage />
            <h2 id="your-claims-or-appeals" className="vads-u-margin-top--2p5">
              Your claims or appeals
            </h2>
            <div>{this.renderErrorMessages()}</div>
            <p />
            <va-additional-info
              className="claims-combined"
              trigger="Find out why we sometimes combine claims."
            >
              {consolidatedClaimsContent}
            </va-additional-info>
            <p />
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
      </div>
    );
  }
}

YourClaimsPageV2.propTypes = {
  appealsAvailable: PropTypes.string,
  appealsLoading: PropTypes.bool,
  canAccessAppeals: PropTypes.bool,
  canAccessClaims: PropTypes.bool,
  changePageV2: PropTypes.func,
  claimsAvailable: PropTypes.string,
  claimsLoading: PropTypes.bool,
  fullName: PropTypes.shape({}),
  getAppealsV2: PropTypes.func,
  getClaimsV2: PropTypes.func,
  getStemClaims: PropTypes.func,
  hide30DayNotice: PropTypes.func,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string,
      attributes: PropTypes.shape({}),
    }),
  ),
  listLength: PropTypes.number,
  page: PropTypes.number,
  pages: PropTypes.number,
  show30DayNotice: PropTypes.bool,
  stemClaimsLoading: PropTypes.bool,
};

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const claimsRoot = claimsState.claims;
  const claimsV2Root = claimsState.claimsV2; // this is where all the meat is for v2
  const profileState = state.user.profile;
  const canAccessAppeals = profileState.services.includes(
    backendServices.APPEALS_STATUS,
  );
  const canAccessClaims = profileState.services.includes(
    backendServices.EVSS_CLAIMS,
  );
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
  const list = getVisibleRows(sortedList, claimsV2Root.page);

  return {
    appealsAvailable: claimsV2Root.v2Availability,
    claimsAvailable: claimsV2Root.claimsAvailability,
    // claimsAuthorized: claimsState.claimSync.authorized,
    claimsLoading: claimsV2Root.claimsLoading,
    appealsLoading: claimsV2Root.appealsLoading,
    stemClaimsLoading: claimsV2Root.stemClaimsLoading,
    list,
    listLength: sortedList.length,
    page: claimsV2Root.page,
    pages: claimsV2Root.pages,
    sortProperty: claimsRoot.sortProperty,
    consolidatedModal: claimsRoot.consolidatedModal,
    show30DayNotice: claimsRoot.show30DayNotice,
    synced: claimsState.claimSync.synced,
    canAccessAppeals,
    canAccessClaims,
    fullName: state.user.profile.userFullName,
  };
}

const mapDispatchToProps = {
  getAppealsV2: getAppealsV2Action,
  getClaimsV2: getClaimsV2Action,
  getStemClaims: getStemClaimsAction,
  changePageV2: changePageV2Action,
  sortClaims: sortClaimsAction,
  hide30DayNotice: hide30DayNoticeAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(YourClaimsPageV2);

export { YourClaimsPageV2 };
