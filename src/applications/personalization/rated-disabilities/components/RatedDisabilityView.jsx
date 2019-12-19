import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import RatedDisabilityList from './RatedDisabilityList';
import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import RatedDisabilitiesSidebar from '../components/RatedDisabilitiesSidebar';
import facilityLocator from 'applications/facility-locator/manifest.json';

class RatedDisabilityView extends React.Component {
  static propTypes = {
    fetchRatedDisabilities: PropTypes.func.isRequired,
    ratedDisabilities: PropTypes.shape({
      ratedDisabilities: PropTypes.array,
    }),
  };

  componentDidMount() {
    this.props.fetchTotalDisabilityRating();
  }

  renderMVIError() {
    return (
      <AlertBox
        headline="We’re having trouble matching your information to our veteran records"
        content={
          <div>
            <p>
              We’re having trouble matching your information to our veteran
              records, so we can’t give you access to tools for managing your
              health and benefits.
            </p>
            <p>
              If you’d like to use these tools on VA.gov, please contact your
              nearest VA medical center. Let them know you need to verify the
              information in your records, and update it as needed. The
              operator, or a patient advocate, can connect you with the right
              person who can help.
            </p>
            <p>
              <a href={facilityLocator.rootUrl}>
                Find your nearest VA medical center
              </a>
            </p>
          </div>
        }
        status="warning"
        className="vads-u-margin-y--2"
      />
    );
  }

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
      } else {
        content = this.renderMVIError();
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
