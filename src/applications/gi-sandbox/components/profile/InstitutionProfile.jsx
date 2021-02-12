import PropTypes from 'prop-types';
import React from 'react';

import ProfileSection from '../ProfileSection';
import HeadingSummary from './HeadingSummary';
import { convertRatingToStars, createId } from '../../utils/helpers';
import { MINIMUM_RATING_COUNT } from '../../constants';
import ProfileNavBar from '../ProfileNavBar';

export class InstitutionProfile extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
  };

  shouldShowSchoolLocations = facilityMap =>
    facilityMap &&
    (facilityMap.main.extensions.length > 0 ||
      facilityMap.main.branches.length > 0);

  render() {
    const { profile, showModal } = this.props;

    const stars = convertRatingToStars(profile.attributes.ratingAverage);
    const displayStars =
      stars && profile.attributes.ratingCount >= MINIMUM_RATING_COUNT;

    const profileSections = {
      'Estimate your benefits': {
        display: true,
        component: <div />,
      },
      'Institution Details': {
        display: true,
      },
      'Fields of Study': {
        display: true,
      },
      'School locations': {
        display: this.shouldShowSchoolLocations(profile.attributes.facilityMap),
      },
      'Cautionary information': {
        display: true,
      },
      'Student ratings': {
        display: displayStars,
      },
      'Contact details': {
        display: true,
      },
    };

    return (
      <div className="institution-profile">
        <HeadingSummary
          institution={profile.attributes}
          onLearnMore={showModal.bind(this, 'gibillstudents')}
        />
        <ProfileNavBar profileSections={Object.keys(profileSections)} />
        <div>
          <ul>
            {Object.entries(profileSections).map(([section, props]) => {
              if (props.display) {
                return (
                  <ProfileSection
                    key={`${createId(section)}-profile-section`}
                    name={section}
                  >
                    {props.component}
                  </ProfileSection>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default InstitutionProfile;
