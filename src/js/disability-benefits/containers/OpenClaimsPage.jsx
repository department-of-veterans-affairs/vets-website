import React from 'react';
import { connect } from 'react-redux';

import { getClaims, getFilteredClaims, changePage } from '../actions';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { scrollToTop, setUpPage, setPageFocus } from '../utils/page';

class OpenClaimsPage extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }
  componentDidMount() {
    if (this.props.allClaims) {
      this.props.getFilteredClaims();
    } else {
      this.props.getClaims();
    }
    if (this.props.loading) {
      scrollToTop();
    } else {
      setUpPage();
    }
  }
  componentDidUpdate(prevProps) {
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
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

OpenClaimsPage.defaultProps = {
  allClaims: __ALL_CLAIMS_ENABLED__ // eslint-disable-line no-undef
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenClaimsPage);

export { OpenClaimsPage };
