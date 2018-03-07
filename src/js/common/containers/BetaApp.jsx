import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import objectValues from 'lodash/fp/values';
import { getBetaFeatures, registerBetaToSession as registerBeta, statuses } from '../actions';
import AlertBox from '../components/AlertBox';

export const features = {
  healthAccount: 'health_account',
  veteranIdCard: 'veteran_id_card',
  personalization: 'personalization'
};

class BetaApp extends React.Component {

  static propTypes = {
    featureName: PropTypes.oneOf(objectValues(features)).isRequired,
    betaFeatures: PropTypes.arrayOf(
      PropTypes.shape({
        feature: PropTypes.string,
        loading: PropTypes.bool,
        status: PropTypes.oneOf(objectValues(statuses))
      })
    )
  };

  constructor(props) {
    super(props);
    this.registerBeta = this.props.registerBeta.bind(this, this.props.featureName);
  }

  render() {
    if (this.props.feature && this.props.feature.status === statuses.succeeded) return this.props.children;

    const feature = this.props.feature;
    const pending = feature.status === statuses.pending;

    return (
      <div className="row-padded" style={{ marginBottom: 15 }}>
        <h1>This application is currently in beta</h1>
        <button type="button"
          disabled={pending}
          className="usa-button-primary" onClick={this.registerBeta}>
          Register for beta access {pending && <i className="fa fa-spin fa-spinner"/>}
        </button>
        <AlertBox
          isVisible={!!feature && feature.status === statuses.failed}
          status="error"
          content={<h3>Failed to register for beta</h3>}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    feature: state.betaFeatures.find(b => b.feature === ownProps.featureName) || {}
  };
};

const mapDispatchToProps = {
  getBetaFeatures,
  registerBeta
};

export { BetaApp };

export default connect(mapStateToProps, mapDispatchToProps)(BetaApp);
