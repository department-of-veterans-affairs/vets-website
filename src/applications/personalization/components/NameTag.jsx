import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

import { SERVICE_BADGE_IMAGE_PATHS } from '../profile/constants';
import { getServiceBranchDisplayName } from '../profile/helpers';

const NameTag = ({
  userFullName: { first, middle, last, suffix },
  latestBranchOfService,
  showBadgeImage,
  totalDisabilityRating,
  showUpdatedNameTag,
}) => {
  const fullName = [first, middle, last, suffix]
    .filter(name => !!name)
    .join(' ');

  // the outer full-width background of the header banner
  const wrapperClasses = prefixUtilityClasses([
    'background-color--gray-dark',
    'margin-bottom--0',
    'padding-y--2',
  ]);

  const updatedWrapperClasses = prefixUtilityClasses([
    'background-color--primary',
    'margin-bottom--0',
    'padding-y--2',
  ]);

  const wrapperClassesMedium = prefixUtilityClasses(
    ['padding-y--2p5', 'margin-bottom--2'],
    'medium',
  );

  // the inner content of the header banner
  const innerWrapperClasses = prefixUtilityClasses([
    'align-items--center',
    'color--white',
    'display--flex',
    'flex-direction--column',
    'width--full',
  ]);
  const innerWrapperClassesMedium = prefixUtilityClasses(
    ['flex-direction--row', 'padding-left--2'],
    'medium',
  );

  const serviceBadgeClasses = prefixUtilityClasses(['display--none']);
  const serviceBadgeClassesMedium = prefixUtilityClasses(
    ['display--flex', 'justify-content--flex-end', 'margin-bottom--0'],
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
    'font-family--serif',
    'font-size--h3',
    'font-weight--bold',
    'line-height--3',
    'margin-top--0',
    'margin-bottom--0p5',
    'text-align--center',
  ]);
  const fullNameClassesMedium = prefixUtilityClasses(
    ['text-align--left', 'margin-bottom--1p5'],
    'medium',
  );

  const latestBranchClasses = prefixUtilityClasses([
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'line-height--3',
    'margin--0',
    'text-align--center',
  ]);
  const latestBranchClassesMedium = prefixUtilityClasses(
    ['text-align--left'],
    'medium',
  );

  const wrapperClassDerived = showUpdatedNameTag
    ? updatedWrapperClasses
    : wrapperClasses;

  const classes = {
    wrapper: [...wrapperClassDerived, ...wrapperClassesMedium].join(' '),
    innerWrapper: [
      ...innerWrapperClasses,
      ...innerWrapperClassesMedium,
      'usa-grid',
      'usa-grid-full',
    ].join(' '),
    serviceBadge: [...serviceBadgeClasses, ...serviceBadgeClassesMedium].join(
      ' ',
    ),
    title: [...titleClasses, ...titleClassesMedium].join(' '),
    fullName: [...fullNameClasses, ...fullNameClassesMedium].join(' '),
    latestBranch: [...latestBranchClasses, ...latestBranchClassesMedium].join(
      ' ',
    ),
  };

  return (
    <div className={classes.wrapper} data-testid="name-tag">
      <div className={classes.innerWrapper}>
        <div className={classes.serviceBadge}>
          {showBadgeImage && (
            <img
              src={SERVICE_BADGE_IMAGE_PATHS.get(latestBranchOfService)}
              alt={`${latestBranchOfService} seal`}
              className="vads-u-padding-right--3"
              style={{ maxHeight: '75px' }}
            />
          )}
        </div>
        <div>
          <dl className="vads-u-margin-y--0">
            <dt className="sr-only">Name: </dt>
            <dd className={classes.fullName}>{fullName}</dd>
            {latestBranchOfService && (
              <dd className={classes.latestBranch}>
                <dfn className="sr-only">Branch of service: </dfn>
                {getServiceBranchDisplayName(latestBranchOfService)}
              </dd>
            )}
            {showUpdatedNameTag &&
              totalDisabilityRating && (
                <>
                  <dt className="sr-only">total disability rating</dt>
                  <dd className="vads-u-margin-top--0p5">
                    <a
                      href="/disability/view-disability-rating/rating"
                      aria-label="view your disability rating"
                      className="vads-u-color--white font-weight--bold"
                    >
                      {totalDisabilityRating}% Service connected{' '}
                      <i
                        aria-hidden="true"
                        role="img"
                        className="fas fa-chevron-right vads-u-padding-left--0p5"
                      />
                    </a>
                  </dd>
                </>
              )}
          </dl>
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

NameTag.defaultProps = {
  userFullName: {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  latestBranchOfService: '',
};

NameTag.propTypes = {
  showBadgeImage: PropTypes.bool,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  latestBranchOfService: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(NameTag);
