import React from 'react';
import { connect } from 'react-redux';

import { getClaims } from '../actions';
import AskVAQuestions from '../components/AskVAQuestions';
import ClaimsListItem from '../components/ClaimsListItem';
import NoClaims from '../components/NoClaims';

class YourClaimsPage extends React.Component {
  componentDidMount() {
    this.props.getClaims();
  }
  render() {
    const { claims } = this.props;

    let content;

    if (claims === null) {
      content = <div>Loading...</div>;
    } else if (claims.length > 0) {
      content = (<div className="claim-list">
        {claims.map(claim => <ClaimsListItem claim={claim} key={claim.id}/>)}
      </div>);
    } else {
      content = <NoClaims/>;
    }

    return (
      <div>
        <div className="row">
          <div className="large-8 columns your-claims">
            <div>
              <h1>Your Claims</h1>
            </div>
            {content}
          </div>
          <AskVAQuestions/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    claims: state.claims.list
  };
}

const mapDispatchToProps = {
  getClaims
};

export default connect(mapStateToProps, mapDispatchToProps)(YourClaimsPage);

