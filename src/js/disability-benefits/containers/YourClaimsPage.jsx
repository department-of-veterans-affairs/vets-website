import React from 'react';
import { connect } from 'react-redux';

import Modal from '../../common/components/Modal';
import { getClaims, filterClaims, sortClaims, changePage, showConsolidatedMessage, hide30DayNotice } from '../actions';
import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ClaimSyncWarning from '../components/ClaimSyncWarning';
import AskVAQuestions from '../components/AskVAQuestions';
import ConsolidatedClaims from '../components/ConsolidatedClaims';
import FeaturesWarning from '../components/FeaturesWarning';
import MainTabNav from '../components/MainTabNav';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ClosedClaimMessage from '../components/ClosedClaimMessage';
import { scrollToTop, setUpPage, setPageFocus } from '../utils/page';

const sortOptions = [
  {
    label: 'A-Z by claim type',
    value: 'claimType'
  },
  {
    label: 'Last updated',
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
    this.props.getClaims(this.getFilter(this.props));
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

  render() {
    const { unfilteredClaims, claims, pages, page, loading, show30DayNotice, route, synced } = this.props;

    let content;

    if (loading) {
      content = <LoadingIndicator message="Loading claims list" setFocus/>;
    } else if (claims.length > 0) {
      content = (<div>
        {!route.showClosedClaims && show30DayNotice && <ClosedClaimMessage claims={unfilteredClaims} onClose={this.props.hide30DayNotice}/>}
        <div className="claim-list">
          {claims.map(claim => <ClaimsListItem claim={claim} key={claim.id}/>)}
          <Pagination page={page} pages={pages} onPageSelect={this.changePage}/>
        </div>
      </div>);
    } else {
      content = <NoClaims/>;
    }

    if (!loading) {
      const currentTab = `${route.showClosedClaims ? 'Closed' : 'Open'}Claims`;
      content = (
        <div>
          <MainTabNav/>
          <div className="va-tab-content" role="tabpanel" id={`tabPanel${currentTab}`} aria-labelledby={`tab${currentTab}`}>
            <div className="claims-list-sort">
              <ErrorableSelect
                  label="Sort by"
                  includeBlankOption={false}
                  options={sortOptions}
                  value={{ value: this.props.sortProperty }}
                  onValueChange={this.handleSort}/>
            </div>
            {content}
          </div>
        </div>
      );
    }

    return (
      <div className="your-claims">
        <div className="row">
          <div>
            <h1>Your Claims</h1>
          </div>
          {!loading && !synced && <ClaimSyncWarning olderVersion={claims.length}/>}
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
  return {
    loading: claimsState.claims.list === null,
    claims: claimsState.claims.visibleRows,
    unfilteredClaims: claimsState.claims.list,
    page: claimsState.claims.page,
    pages: claimsState.claims.pages,
    sortProperty: claimsState.claims.sortProperty,
    consolidatedModal: claimsState.claims.consolidatedModal,
    show30DayNotice: claimsState.claims.show30DayNotice,
    synced: claimsState.claimSync.synced
  };
}

const mapDispatchToProps = {
  getClaims,
  filterClaims,
  changePage,
  sortClaims,
  showConsolidatedMessage,
  hide30DayNotice
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

export { YourClaimsPage };
