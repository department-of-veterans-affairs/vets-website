import React from 'react';
import { connect } from 'react-redux';

import Modal from '../../common/components/Modal';
import { getAppeals, getClaims, filterClaims, sortClaims, changePage, showConsolidatedMessage, hide30DayNotice } from '../actions';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ClaimsUnauthorized from '../components/ClaimsUnauthorized';
import ClaimsUnavailable from '../components/ClaimsUnavailable';
import ClaimsAppealsUnavailable from '../components/ClaimsAppealsUnavailable';
import AppealsUnavailable from '../components/AppealsUnavailable';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import AskVAQuestions from '../components/AskVAQuestions';
import ConsolidatedClaims from '../components/ConsolidatedClaims';
import FeaturesWarning from '../components/FeaturesWarning';
import MainTabNav from '../components/MainTabNav';
import ClaimsListItem from '../components/ClaimsListItem';
import AppealListItem from '../components/AppealListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ClosedClaimMessage from '../components/ClosedClaimMessage';
import { scrollToTop, setUpPage, setPageFocus } from '../utils/page';
import Breadcrumbs from '../components/Breadcrumbs';

const sortOptions = [
  {
    label: 'A-Z by type',
    value: 'claimType'
  },
  {
    label: 'Last changed',
    value: 'phaseChangeDate'
  },
  {
    label: 'Received date',
    value: 'dateFiled'
  }
];

class YourClaimsPage extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }
  componentDidMount() {
    document.title = 'Track Claims: Vets.gov';

    if (this.props.canAccessClaims) {
      this.props.getClaims(this.getFilter(this.props));
    }

    if (this.props.canAccessAppeals) {
      this.props.getAppeals(this.getFilter(this.props));
    }

    if (this.props.loading) {
      scrollToTop();
    } else {
      setUpPage();
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.route.showClosedClaims !== newProps.route.showClosedClaims) {
      this.props.filterClaims(this.getFilter(newProps));
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }
  getFilter(props) {
    return props.route.showClosedClaims ? 'closed' : 'open';
  }
  handleSort(sortObject) {
    this.props.sortClaims(sortObject.value);
  }
  changePage(page) {
    this.props.changePage(page);
    scrollToTop();
  }

  renderListItem(claim) {
    if (claim.type === 'appeals_status_models_appeals') {
      return <AppealListItem key={claim.id} appeal={claim}/>;
    }

    return <ClaimsListItem claim={claim} key={claim.id}/>;
  }

  renderErrorMessages() {
    const { loading, appealsAvailable, canAccessAppeals, canAccessClaims, claimsAvailable, claimsAuthorized } = this.props;

    if (loading) {
      return null;
    }

    if (canAccessAppeals && canAccessClaims) {
      if (!claimsAvailable && !appealsAvailable) {
        return <ClaimsAppealsUnavailable/>;
      }
    }

    if (canAccessClaims) {
      if (!claimsAvailable) {
        return <ClaimsUnavailable/>;
      } else if (!claimsAuthorized) {
        return <ClaimsUnauthorized/>;
      }
    }

    if (canAccessAppeals && !appealsAvailable) {
      return <AppealsUnavailable/>;
    }

    return null;
  }

  render() {
    const { unfilteredAppeals, unfilteredClaims, list, pages, page, loading, show30DayNotice, route, synced } = this.props;
    const tabs = [
      'OpenClaims',
      'ClosedClaims'
    ];

    let content;
    let innerContent;

    if (loading) {
      content = <LoadingIndicator message="Loading a list of your claims and appeals..." setFocus/>;
    } else {
      if (list.length > 0) {
        innerContent = (<div>
          {!route.showClosedClaims && show30DayNotice && <ClosedClaimMessage claims={unfilteredClaims.concat(unfilteredAppeals)} onClose={this.props.hide30DayNotice}/>}
          <div className="claim-list">
            {list.map(claim => this.renderListItem(claim))}
            <Pagination page={page} pages={pages} onPageSelect={this.changePage}/>
          </div>
        </div>);
      } else if (!this.props.canAccessClaims) {
        innerContent = <NoClaims/>;
      }

      const currentTab = `${route.showClosedClaims ? 'Closed' : 'Open'}Claims`;
      content = (
        <div>
          <MainTabNav/>
          {tabs.map(tab => (
            <div
              key={tab}
              role="tabpanel"
              id={`tabPanel${tab}`}
              aria-labelledby={`tab${tab}`}
              aria-hidden={currentTab !== tab}>
              {currentTab === tab &&
                <div className="va-tab-content">
                  <div className="claims-list-sort">
                    <ErrorableSelect
                      label="Sort by"
                      includeBlankOption={false}
                      options={sortOptions}
                      value={{ value: this.props.sortProperty }}
                      onValueChange={this.handleSort}/>
                  </div>
                  {innerContent}
                </div>
              }
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="your-claims">
        <Breadcrumbs/>
        <div className="row">
          <div className="small-12 columns">
            {this.renderErrorMessages()}
          </div>
        </div>
        <div className="row">
          <div className="small-12 columns">
            <h1>Your Claims and Appeals</h1>
          </div>
          <div className="small-12 columns">
            {!loading && !synced && <ClaimSyncWarning olderVersion={list.length}/>}
          </div>
        </div>
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <p>
              <a href className="claims-combined" onClick={(evt) => {
                evt.preventDefault();
                window.dataLayer.push({
                  event: 'claims-consolidated-modal',
                });
                this.props.showConsolidatedMessage(true);
              }}>Find out why we sometimes combine claims.</a>
            </p>
            {content}
            <Modal
              onClose={() => true}
              visible={this.props.consolidatedModal}
              hideCloseButton
              id="consolidated-claims"
              cssClass="claims-upload-modal"
              contents={<ConsolidatedClaims onClose={() => this.props.showConsolidatedMessage(false)}/>}/>
          </div>
          <div className="small-12 usa-width-one-third medium-4 columns">
            <FeaturesWarning/>
            <AskVAQuestions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  const claimsRoot = claimsState.claims;
  const profileState = state.user.profile;
  const canAccessAppeals = profileState.services.includes('appeals-status');
  const canAccessClaims = profileState.services.includes('evss-claims');

  return {
    appealsAvailable: claimsState.appeals.available,
    claimsAuthorized: claimsState.claimSync.authorized,
    claimsAvailable: claimsState.claimSync.available,
    loading: claimsRoot.loading,
    list: claimsRoot.visibleRows,
    unfilteredClaims: claimsRoot.claims,
    unfilteredAppeals: claimsRoot.appeals,
    page: claimsRoot.page,
    pages: claimsRoot.pages,
    sortProperty: claimsRoot.sortProperty,
    consolidatedModal: claimsRoot.consolidatedModal,
    show30DayNotice: claimsRoot.show30DayNotice,
    synced: claimsState.claimSync.synced,
    canAccessAppeals,
    canAccessClaims,
  };
}

const mapDispatchToProps = {
  getAppeals,
  getClaims,
  filterClaims,
  changePage,
  sortClaims,
  showConsolidatedMessage,
  hide30DayNotice
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

export { YourClaimsPage };
