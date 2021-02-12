import PropTypes from 'prop-types';
import React from 'react';

import ProfileSection from '../ProfileSection';
import HeadingSummary from './HeadingSummary';
import { convertRatingToStars, createId } from '../../utils/helpers';
import { MINIMUM_RATING_COUNT } from '../../constants';
import ProfileNavBar from '../ProfileNavBar';
// import _ from 'lodash';

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

    const profileSections = [
      {
        name: 'Estimate your benefits',
        component: <div />,
      },
      {
        name: 'Institution Details',
      },
      {
        name: 'Fields of Study',
      },
      {
        name: 'School locations',
        hide: !this.shouldShowSchoolLocations(profile.attributes.facilityMap),
      },
      {
        name: 'Cautionary information',
      },
      {
        name: 'Student ratings',
        hide: !displayStars,
      },
      {
        name: 'Contact details',
      },
    ];

    // const visibleSections = profileSections.filter(
    //   section => !_.get(section, 'hide', false),
    // );
    const visibleSections = profileSections; // just doing this until we want sections to hide/show for testing
    const sectionNames = visibleSections.map(({ name }) => name);

    return (
      <div className="institution-profile">
        <HeadingSummary
          institution={profile.attributes}
          onLearnMore={showModal.bind(this, 'gibillstudents')}
        />
        <ProfileNavBar profileSections={sectionNames} />
        <div className="row">
          <ul>
            {visibleSections.map(({ name, component }) => {
              return (
                <ProfileSection
                  key={`${createId(name)}-profile-section`}
                  name={name}
                >
                  {component}
                </ProfileSection>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default InstitutionProfile;
