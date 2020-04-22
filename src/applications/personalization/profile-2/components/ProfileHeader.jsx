import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { SERVICE_BADGE_IMAGE_PATHS } from '../constants';
import { getServiceBranchDisplayName, prefixUtilityClasses } from '../helpers';

const ProfileHeader = ({
  userFullName: { first, middle, last, suffix },
  latestBranchOfService,
  showBadgeImage,
}) => {
  const fullName = [first, middle, last, suffix]
    .filter(name => !!name)
    .join(' ');

  // the outer full-width background of the header banner
  const wrapperClasses = prefixUtilityClasses([
    'background-color--gray-dark',
    'margin-bottom--2',
    'padding-y--2',
  ]);
  const wrapperClassesMedium = prefixUtilityClasses(['padding-y--3'], 'medium');

  // the inner content of the header banner
  const innerWrapperClasses = prefixUtilityClasses([
    'align-items--center',
    'color--white',
    'display--flex',
    'flex-direction--column',
    'width--full',
  ]);
  const innerWrapperClassesMedium = prefixUtilityClasses(
    ['flex-direction--row'],
    'medium',
  );

  const serviceBadgeClasses = prefixUtilityClasses([
    'text-align--center',
    'margin-bottom--2',
  ]);
  const serviceBadgeClassesMedium = prefixUtilityClasses(
    ['text-align--right', 'margin-bottom--0', 'padding-right--2'],
    'medium',
  );

  const titleClasses = prefixUtilityClasses([
    'display--none',
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'margin-bottom--2',
    'margin-top--0',
  ]);
  const titleClassesMedium = prefixUtilityClasses(['display--flex'], 'medium');

  const fullNameClasses = prefixUtilityClasses([
    'font-size--h3',
    'margin-top--0',
    'margin-bottom--1p5',
    'text-align--center',
  ]);
  const fullNameClassesMedium = prefixUtilityClasses(
    ['text-align--left'],
    'medium',
  );

  const latestBranchClasses = prefixUtilityClasses([
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'margin--0',
    'text-align--center',
  ]);
  const latestBranchClassesMedium = prefixUtilityClasses(
    ['text-align--left'],
    'medium',
  );

  return (
    <div className={[...wrapperClasses, ...wrapperClassesMedium].join(' ')}>
      <div
        className={[
          ...innerWrapperClasses,
          ...innerWrapperClassesMedium,
          'usa-grid',
          'usa-grid-full',
        ].join(' ')}
      >
        <div
          className={[
            ...serviceBadgeClasses,
            ...serviceBadgeClassesMedium,
            'usa-width-one-fourth',
          ].join(' ')}
        >
          {showBadgeImage && (
            <img
              className="profile-service-badge"
              src={SERVICE_BADGE_IMAGE_PATHS.get(latestBranchOfService)}
              alt="service badge"
            />
          )}
        </div>
        <div className="name-and-title-wrapper">
          <h1 className={[...titleClasses, ...titleClassesMedium].join(' ')}>
            Your Profile
          </h1>
          <h2
            className={[...fullNameClasses, ...fullNameClassesMedium].join(' ')}
          >
            {fullName}
          </h2>
          {latestBranchOfService && (
            <h3
              className={[
                ...latestBranchClasses,
                ...latestBranchClassesMedium,
              ].join(' ')}
            >
              {getServiceBranchDisplayName(latestBranchOfService)}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const latestBranchOfService = orderBy(
    state.vaProfile?.militaryInformation?.serviceHistory?.serviceHistory,
    ['endDate'],
    'desc',
  )[0]?.branchOfService;

  return {
    userFullName: state.vaProfile?.hero?.userFullName,
    latestBranchOfService,
    showBadgeImage: SERVICE_BADGE_IMAGE_PATHS.has(latestBranchOfService),
  };
};

ProfileHeader.defaultProps = {
  userFullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  latestBranchOfService: '',
};

ProfileHeader.propTypes = {
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  latestBranchOfService: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ProfileHeader);
