import React from 'react';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';

import Modal from '../../common/components/Modal';
import { getClaims, changePage, showConsolidatedMessage } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';
import Pagination from '../../common/components/Pagination';
import Loading from '../components/Loading';
import ConsolidatedClaims from '../components/ConsolidatedClaims';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
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
      content = <Loading/>;
    } else if (claims.length > 0) {
      content = (<div className="claim-list">
        {claims.map(claim => <ClaimsListItem claim={claim} key={claim.id}/>)}
        <Pagination page={page} pages={pages} onPageSelect={this.props.changePage}/>
      </div>);
    } else {
      content = <NoClaims/>;
    }

    return (
      <div>
        <Element name="topScrollElement"/>
        <div className="row">
          <div className="large-8 columns your-claims">
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
          <AskVAQuestions/>
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
