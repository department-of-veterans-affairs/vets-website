import React from 'react';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';

import Modal from '../../common/components/Modal';
import { getClaims, changePage, showConsolidatedMessage } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import ConsolidatedClaims from '../components/ConsolidatedClaims';
import FeaturesWarning from '../components/FeaturesWarning';

const scroller = Scroll.animateScroll;

const scrollToTop = () => {
  scroller.scrollToTop({
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class YourClaimsPage extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }
  componentDidMount() {
    this.props.getClaims();
    document.title = 'Your Claims';
  }
  changePage(page) {
    this.props.changePage(page);
    scrollToTop();
  }
  render() {
    const { claims, pages, page, loading } = this.props;

    let content;

    if (loading) {
      content = <LoadingIndicator/>;
    } else if (claims.length > 0) {
      content = (<div className="claim-list">
        {claims.map(claim => <ClaimsListItem claim={claim} key={claim.id}/>)}
        <Pagination page={page} pages={pages} onPageSelect={this.changePage}/>
      </div>);
    } else {
      content = <NoClaims/>;
    }

    return (
      <div className="your-claims">
        <div className="row">
          <div className="small-12 medium-8 columns">
            <div>
              <h1>Your Claims</h1>
            </div>
            <p>
              <a href onClick={(evt) => {
                evt.preventDefault();
                this.props.showConsolidatedMessage(true);
              }}>Sometimes claims get combined. Find out why.</a>
            </p>
            {content}
            <Modal
                onClose={() => true}
                visible={this.props.consolidatedModal}
                hideCloseButton
                cssClass="claims-upload-modal"
                contents={<ConsolidatedClaims onClose={() => this.props.showConsolidatedMessage(false)}/>}/>
          </div>
          <div className="small-12 medium-4 columns">
            <FeaturesWarning/>
            <AskVAQuestions/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.claims.list === null,
    claims: state.claims.visibleRows,
    pages: state.claims.pages,
    page: state.claims.page,
    consolidatedModal: state.claims.consolidatedModal
  };
}

const mapDispatchToProps = {
  getClaims,
  changePage,
  showConsolidatedMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

export { YourClaimsPage };
