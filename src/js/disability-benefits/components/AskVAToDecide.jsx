import React from 'react';
import { withRouter } from 'react-router';

class AskVAToDecide extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-info claims-no-icon claims-alert-status">
        <h4>Ask VA to decide your claims</h4>
        <p>
          You can ask VA to start evaluating your claim if you don't have anymore documents or evidence to file.
        </p>
        <button
            className="va-button-secondary request-decision-button"
            onClick={() => this.props.router.push(`/your-claims/${this.props.id}/ask-va-to-decide`)}>
          View Details
        </button>
      </div>
    );
  }
}

AskVAToDecide.propTypes = {
  id: React.PropTypes.string.isRequired
};

export default withRouter(AskVAToDecide);
