import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBetaFeatures, registerBeta } from '../actions';
import LoadingIndicator from '../components/LoadingIndicator';

class BetaApp extends React.Component {

  static propTypes = {
    featureName: PropTypes.string.isRequired,
    betaFeatures: PropTypes.arrayOf(
      PropTypes.shape({
        feature: PropTypes.string,
        loading: PropTypes.bool,
        status: PropTypes.oneOf(['succeeded', 'failed'])
      })
    )
  };

  constructor(props) {
    super(props);
    this.registerBeta = this.props.registerBeta.bind(this, this.props.featureName);
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator message="Loading beta information..."/>;
    }

    switch (this.props.feature.status) {
      case 'succeeded':
        return this.props.children;
      case 'failed':
        return <h1>Failed to registered for beta.</h1>;
      default:
        return (
          <div>
            <h1>This application is currently in beta</h1>
            <button className="usa-button-primary" onClick={this.registerBeta}>Register for beta access</button>
          </div>
        );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const loading = state.user.profile.loading;
  return {
    loading,
    feature: loading && state.betaFeatures.find(b => b.feature === ownProps.featureName)
  };
};

const mapDispatchToProps = {
  getBetaFeatures,
  registerBeta
};

export { BetaApp };

export default connect(mapStateToProps, mapDispatchToProps)(BetaApp);
