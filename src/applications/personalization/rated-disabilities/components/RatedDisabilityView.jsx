import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import RatedDisabilityList from './RatedDisabilityList';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import RatedDisabilitiesSidebar from '../components/RatedDisabilitiesSidebar';

class RatedDisabilityView extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  render() {
    const {
      fetchRatedDisabilities,
      ratedDisabilities,
      user,
      totalDisabilityRating,
      loading,
      error,
    } = this.props;

    let content;

    // Total Disability Calculation and Pending Disabilities should go here.
    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <>
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <div className="vads-l-row">
                <div className="vads-l-col--12">
                  <h1>Your VA disability rating</h1>
                </div>
              </div>
              <TotalRatedDisabilities
                totalDisabilityRating={totalDisabilityRating}
                loading={loading}
                error={error}
              />
              <RatedDisabilityList
                fetchRatedDisabilities={fetchRatedDisabilities}
                ratedDisabilities={ratedDisabilities}
              />
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col--4">
              <RatedDisabilitiesSidebar />
            </div>
          </>
        );
      }
    }

    return (
      <div>
        <div className="medium-screen:vads-u-padding-left--1p5 large-screen:vads-u-padding-left--6">
          <Breadcrumbs>
            {[
              <a href="/" aria-label="back to VA Home page" key="1">
                Home
              </a>,
              <a
                href="/disability"
                aria-label="Back to the Disability Benefits page"
                key="2"
              >
                Disability Benefits
              </a>,
              <a
                href="/disability/check-disability-rating"
                aria-label="back to the view your VA disability rating page"
                key="3"
              >
                View your VA disability rating
              </a>,
              <a href="/disability/check-disability-rating/rating" key="4">
                Your VA disability rating
              </a>,
            ]}
          </Breadcrumbs>
        </div>
        <div className="vads-l-grid-container">
          <div className="vads-l-row">{content}</div>
        </div>
      </div>
    );
  }
}

export default RatedDisabilityView;
