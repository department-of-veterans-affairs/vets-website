import React from 'react';
import { connect } from 'react-redux';

import { fetchRatedDisabilities } from '../actions';

import CallToActionWidget from 'platform/site-wide/cta-widget';
import RatedDisabilityView from '../components/RatedDisabilityView';

class RatedDisabilitiesApp extends React.Component {
  render() {
    const { ratedDisabilities } = this.props.ratedDisabilities;
    return (
      <>
        {this.props.user.login?.currentlyLoggedIn ? (
          <RatedDisabilityView
            fetchRatedDisabilities={this.props.fetchRatedDisabilities}
            ratedDisabilities={ratedDisabilities}
            user={this.props.user}
          />
        ) : (
          <CallToActionWidget appId="rated-disabilities" />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ratedDisabilities: state.ratedDisabilities,
});

const mapDispatchToProps = {
  fetchRatedDisabilities,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatedDisabilitiesApp);
export { RatedDisabilitiesApp };
