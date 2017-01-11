import React from 'react';
import { connect } from 'react-redux';

import Modal from '../../common/components/Modal';
import { showConsolidatedMessage } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import ConsolidatedClaims from '../components/ConsolidatedClaims';
import FeaturesWarning from '../components/FeaturesWarning';
import MainTabNav from '../components/MainTabNav';

class YourClaimsPage extends React.Component {
  componentDidMount() {
    document.title = 'Track Claims: Vets.gov';
  }

  render() {
    return (
      <div className="your-claims">
        <div className="row">
          <div className="small-12 medium-8 columns">
            <div>
              <h1>Your Claims</h1>
            </div>
            <p>
              <a href className="claims-combined" onClick={(evt) => {
                evt.preventDefault();
                this.props.showConsolidatedMessage(true);
              }}>Find out why we sometimes combine claims.</a>
            </p>
            {this.props.allClaims ? <MainTabNav/> : null}
            {this.props.children}
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
    consolidatedModal: state.claims.consolidatedModal
  };
}

const mapDispatchToProps = {
  showConsolidatedMessage
};

YourClaimsPage.defaultProps = {
  allClaims: __ALL_CLAIMS_ENABLED__ // eslint-disable-line no-undef
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

export { YourClaimsPage };
