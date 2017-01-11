import React from 'react';
import { connect } from 'react-redux';

import { getClaims, getFilteredClaims, changePage } from '../actions';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { scrollToTop, setUpPage, setPageFocus } from '../utils/page';

class ClaimsList extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }
  componentDidMount() {
    this.loadClaims(this.props);
    if (this.props.loading) {
      scrollToTop();
    } else {
      setUpPage();
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.allClaims && this.props.route.showClosedClaims !== newProps.route.showClosedClaims) {
      this.loadClaims(newProps);
      this.changePage(1);
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }
  loadClaims(props) {
    if (props.allClaims) {
      props.getFilteredClaims(!props.route.showClosedClaims);
    } else {
      props.getClaims();
    }
  }
  changePage(page) {
    this.props.changePage(page);
    scrollToTop();
  }
  render() {
    const { claims, pages, page, loading } = this.props;

    let content;

    if (loading) {
      content = <LoadingIndicator message="Loading claims list" setFocus/>;
    } else if (claims.length > 0) {
      content = (<div className="claim-list">
        {claims.map(claim => <ClaimsListItem claim={claim} key={claim.id}/>)}
        <Pagination page={page} pages={pages} onPageSelect={this.changePage}/>
      </div>);
    } else {
      content = <NoClaims/>;
    }

    if (this.props.allClaims) {
      content = (
        <div className="va-tab-content db-tab-content" role="tabpanel" id="tabPanelOpenClaims" aria-labelledby="tabOpenClaims">
          {content}
        </div>
      );
    }
    return content;
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claims.list === null,
    claims: state.claims.visibleRows,
    pages: state.claims.pages,
    page: state.claims.page
  };
}

const mapDispatchToProps = {
  getClaims,
  getFilteredClaims,
  changePage
};

ClaimsList.defaultProps = {
  allClaims: __ALL_CLAIMS_ENABLED__ // eslint-disable-line no-undef
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimsList);

export { ClaimsList };
