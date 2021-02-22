import PropTypes from 'prop-types';
import React from 'react';

import ProfileSection from '../ProfileSection';
import HeadingSummary from './HeadingSummary';
import { convertRatingToStars, createId } from '../../utils/helpers';
import { MINIMUM_RATING_COUNT } from '../../constants';
import ProfileNavBar from '../ProfileNavBar';
import _ from 'lodash';

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

    const loremIpsum = (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div>
    );

    const profileSections = [
      {
        name: 'Estimate your benefits',
        component: loremIpsum,
      },
      {
        name: 'Institution Details',
        component: loremIpsum,
      },
      {
        name: 'Fields of Study',
        component: loremIpsum,
      },
      {
        name: 'School locations',
        hide: !this.shouldShowSchoolLocations(profile.attributes.facilityMap),
        component: loremIpsum,
      },
      {
        name: 'Cautionary information',
        component: loremIpsum,
      },
      {
        name: 'Student ratings',
        hide: !displayStars,
        component: loremIpsum,
      },
      {
        name: 'Contact details',
        component: loremIpsum,
      },
    ];

    const visibleSections = profileSections.filter(
      section => !_.get(section, 'hide', false),
    );
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
