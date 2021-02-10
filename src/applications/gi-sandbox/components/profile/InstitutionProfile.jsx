/* eslint-disable jsx-a11y/anchor-has-content */
import PropTypes from 'prop-types';
import React from 'react';

import ProfileSection from '../ProfileSection';
import HeadingSummary from './HeadingSummary';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import { convertRatingToStars } from '../../utils/helpers';
import { MINIMUM_RATING_COUNT } from '../../constants';

export class InstitutionProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
  };

  shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  scrollToLocations = () => {
    scroller.scrollTo('school-locations', getScrollOptions());
  };

  render() {
    const { profile, showModal } = this.props;

    const stars = convertRatingToStars(profile.attributes.ratingAverage);
    const displayStars =
      stars && profile.attributes.ratingCount >= MINIMUM_RATING_COUNT;

    return (
      <div className="institution-profile">
        <HeadingSummary
          institution={profile.attributes}
          onLearnMore={showModal.bind(this, 'gibillstudents')}
        />
        <div>
          <ul>
            <ProfileSection name="Estimate your benefits" />
            <ProfileSection name="Institution Details" />
            <ProfileSection name="Fields of Study" />
            {this.shouldShowSchoolLocations(profile.attributes.facilityMap) && (
              <ProfileSection name="School locations" />
            )}
            <ProfileSection name="Cautionary information" />
            {displayStars && <ProfileSection name="Student ratings" />}
            <ProfileSection name="Contact details" />
          </ul>
        </div>
      </div>
    );
  }
}

export default InstitutionProfile;
