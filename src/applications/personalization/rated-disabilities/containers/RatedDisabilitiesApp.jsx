import React from 'react';
import { connect } from 'react-redux';

import { fetchRatedDisabilities } from '../actions';

import CallToActionWidget from 'platform/site-wide/cta-widget';
import RatedDisabilityView from '../components/RatedDisabilityView';
import { selectProfile } from 'platform/user/selectors';

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
          <div>
            {!this.props.profile.loading ? (
              <div>
                <h2>Your disability rating</h2>
                <h3>
                  If you got a decision from us that confirms your disability
                  rating, you may be able to get disability compensation or
                  benefits. Review your rating and find out what benefits you
                  can get.
                </h3>
              </div>
            ) : null}
            <CallToActionWidget appId="rated-disabilities" />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { loading } = profile;
  return {
    profile: { loading },
    user: state.user,
    ratedDisabilities: state.ratedDisabilities,
  };
};

const mapDispatchToProps = {
  fetchRatedDisabilities,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatedDisabilitiesApp);
export { RatedDisabilitiesApp };
