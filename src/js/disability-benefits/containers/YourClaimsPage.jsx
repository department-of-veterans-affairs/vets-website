import React from 'react';
import { connect } from 'react-redux';

import { getClaims } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';

class YourClaimsPage extends React.Component {
  componentDidMount() {
    this.props.getClaims();
  }
  render() {
    const { claims } = this.props;

    let claimsList;
    if (claims.length > 0) {
      claimsList = (<div className="claim-list">
        {claims.map(claim =>
          <div key={claim.id} className="claim-list-item">
            <h4>Compensation Claim</h4>
            <p className="status">Status: Complete</p>
            <p><i className="fa fa-exclamation-triangle"></i>We need 2 files from you</p>
            <p><i className="fa fa-envelope"></i>We sent you a development letter</p>
            <p>Last Update: {claim.attributes.dateField}</p>
          </div>
        )}
      </div>);
    } else {
      claimsList = (<div className="you-have-no-claims">
        <h4>You do not have any submitted claims</h4>
        <p>Claims that you have submitted will appear here. If you have an open application for a claim but have not yet submitted it, you can continue your application on <a href="https://www.ebenefits.va.gov/">ebenefits</a></p>
      </div>);
    }

    return (
      <div>
        <div className="row">
          <div className="large-8 columns your-claims">
            <div>
              <h1>Your Claims</h1>
            </div>
            {claimsList}
          </div>
          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    claims: state.claimsList
  };
}

const mapDispatchToProps = {
  getClaims
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

