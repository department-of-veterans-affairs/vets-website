import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import objectValues from 'lodash/fp/values';
import { registerBeta } from '../actions';
import AlertBox from '../components/AlertBox';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  personalization: 'personalization'
};

class BetaApp extends React.Component {

  static propTypes = {
    featureName: PropTypes.oneOf(objectValues(features)).isRequired
  };

  constructor(props) {
    super(props);
    this.registerBeta = this.props.registerBeta.bind(this, this.props.featureName);
  }

  render() {
    if (this.props.loading) return null;
    if (this.props.featureIsEnabled) return this.props.children;

    return (
      <div className="row-padded" style={{ marginBottom: 15 }}>
        <h1>This application is currently in beta</h1>
        <button type="button"
          className="usa-button-primary" onClick={this.registerBeta}>
          Register for beta access
        </button>
        <AlertBox
          isVisible={false}
          status="error"
          content={<h3>Failed to register for beta</h3>}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.user.profile.loading,
    featureIsEnabled: state.user.profile.services.includes(ownProps.featureName)
  };
};

const mapDispatchToProps = {
  registerBeta
};

export { BetaApp };

export default connect(mapStateToProps, mapDispatchToProps)(BetaApp);
