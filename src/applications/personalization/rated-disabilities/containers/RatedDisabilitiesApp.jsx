import React from 'react';
import { connect } from 'react-redux';

import backendServices from 'platform/user/profile/constants/backendServices';
import { fetchRatedDisabilities, fetchTotalDisabilityRating } from '../actions';

// Wonder if we can put RD data in platform...
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import RatedDisabilityView from '../components/RatedDisabilityView';
// import RatedDisabilityHeader from '../components/RatedDisabilityHeader';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import RatedDisabilitiesHeader from '../components/RatedDisabilitiesHeader';

class RatedDisabilitiesApp extends React.Component {
  
  componentDidMount() {
    this.props.fetchTotalDisabilityRating();
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
          <RatedDisabilitiesHeader 
            headline="Your disability rating" 
            content="Review your total combined disability rating and find out what benefits you can get"/>
          <TotalRatedDisabilities
            totalDisabilityRating={this.props.totalDisabilityRating}
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
  totalDisabilityRating: state.totalRating.totalDisabilityRating,
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
