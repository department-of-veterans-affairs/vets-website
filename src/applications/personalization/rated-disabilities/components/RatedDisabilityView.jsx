import React from 'react';
import PropTypes from 'prop-types';

import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import TotalRatedDisabilities from '../components/TotalRatedDisabilities';
import { OnThisPageLink } from './OnThisPageLink';
import RatedDisabilityList from './RatedDisabilityList';

const facilityLocatorUrl = getAppUrl('facilities');

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
      <va-alert status="warning">
        <h2 className="vads-u-margin-y--0 vads-u-font-size--h3" slot="headline">
          We’re having trouble matching your information to our veteran records
        </h2>
        <div>
          <p className="vads-u-font-size--base">
            We’re having trouble matching your information to our veteran
            records, so we can’t give you access to tools for managing your
            health and benefits.
          </p>
          <p className="vads-u-font-size--base">
            If you’d like to use these tools on VA.gov, please contact your
            nearest VA medical center. Let them know you need to verify the
            information in your records, and update it as needed. The operator,
            or a patient advocate, can connect you with the right person who can
            help.
          </p>
          <p>
            <a className="vads-u-font-size--base" href={facilityLocatorUrl}>
              Find your nearest VA medical center
            </a>
          </p>
        </div>
      </va-alert>
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
    let onThisPageHeader = '';
    let combinedRatingLink = '';
    let ratedDisabilitiesLink = '';
    let learnMoreLink = '';

    // If there are rated disabilites then the page gets long enough to fill these links
    if (ratedDisabilities?.ratedDisabilities?.length > 0) {
      onThisPageHeader = <h2 className="vads-u-font-size--h3">On this page</h2>;
      combinedRatingLink = (
        <OnThisPageLink
          text="Your combined disability rating"
          link="#combined-rating"
        />
      );

      ratedDisabilitiesLink = (
        <OnThisPageLink
          text="Your individual ratings"
          link="#individual-ratings"
        />
      );

      learnMoreLink = (
        <OnThisPageLink text="Learn about VA disabilities" link="#learn" />
      );
    }

    // Total Disability Calculation and Pending Disabilities should go here.
    if (user.profile.verified) {
      if (user.profile.status === 'OK') {
        content = (
          <>
            <div className="vads-l-col--12 medium-screen:vads-l-col--12">
              <div className="vads-l-row">
                <div className="vads-l-col--12">
                  <h1>View your VA disability ratings</h1>
                </div>
                <div className="usa-width-one-third">
                  {onThisPageHeader}
                  {combinedRatingLink}
                  {ratedDisabilitiesLink}
                  {learnMoreLink}
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
              <h3
                id="learn"
                className="vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary vads-u-font-size--h2"
              >
                Learn about VA disability ratings
              </h3>
              <p>
                To learn how we determined your VA combined disability rating,
                use our disability rating calculator and ratings table.
              </p>
              <a href="/disability/about-disability-ratings/">
                About VA disability ratings
              </a>
              <h3 className="vads-u-margin-top--3 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
                Need help?
              </h3>
              <p className="vads-u-padding-bottom--3">
                You can call us at <Telephone contact={CONTACTS.VA_BENEFITS} />.
                We're here Monday through Friday, 8:00 a.m to 9:00 p.m. ET.
              </p>
            </div>
          </>
        );
      } else {
        content = this.renderMVIError();
      }
    }

    return (
      <>
        <div className="vads-l-grid-container">
          <div className="vads-l-row">{content}</div>
        </div>
      </>
    );
  }
}

export default RatedDisabilityView;
