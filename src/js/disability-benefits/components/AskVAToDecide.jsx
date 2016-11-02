import React from 'react';
import { Link } from 'react-router';

export default class AskVAToDecide extends React.Component {
  render() {
    return (
      <div className="usa-alert usa-alert-info claims-no-icon claims-alert-status">
        <h4>Ask VA for a Claim Decision</h4>
        <p>
          You can ask VA to start evaluating your claim if you don't have any more documents or evidence to file.
        </p>
        <Link
            className="usa-button"
            to={`/your-claims/${this.props.id}/ask-va-to-decide`}>
          View Details
        </Link>
      </div>
    );
  }
}

AskVAToDecide.propTypes = {
  id: React.PropTypes.string.isRequired
};

