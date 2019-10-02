import React from 'react';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';

// Wonder if we can put RD data in platform...
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import RatedDisabilityView from '../components/RatedDisabilityView';
// import RatedDisabilityHeader from '../components/RatedDisabilityHeader';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';

class RatedDisabilitiesApp extends React.Component {
  
  componentDidUpdate() {
    this.props.fetchTotalDisabilityRating();
    console.log(this.props.totalRatingData);
  }

  render() {
    const { ratedDisabilities } = this.props.ratedDisabilities;
    return (
      <>
        <RequiredLoginView
          authRequired={1}
          serviceRequired={backendServices.USER_PROFILE}
          user={this.props.user}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}
        >
          <TotalRatedDisabilities
            //totalDisabilityRating={this.state.total.totalDisabilityRating}
            loading={this.props.loading}
            error={this.props.error}
          />
          <RatedDisabilityView
            fetchRatedDisabilities={this.props.fetchRatedDisabilities}
            ratedDisabilities={ratedDisabilities}
            user={this.props.user}
          />
        </RequiredLoginView>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  ratedDisabilities: state.ratedDisabilities,
  loading: state.totalRating.loading,
  error: state.totalRating.error,
});

const mapDispatchToProps = {
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RatedDisabilitiesApp);
export { RatedDisabilitiesApp };
