import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

import { SERVICE_BADGE_IMAGE_PATHS } from '../profile/constants';
import { getServiceBranchDisplayName } from '../profile/helpers';
import { formatFullName } from '../common/helpers';

const DisabilityRatingContent = ({ rating }) => {
  const disabilityRatingClasses = prefixUtilityClasses([
    'margin-top--1p5',
    'color--white',
    'text-align--center',
    'line-height--3',
  ]);

  const disabilityRatingClassesMedium = prefixUtilityClasses(
    ['margin-top--1', 'text-align--left', 'display--flex'],
    'medium',
  );

  const disabilityRatingClassesSmall = prefixUtilityClasses(
    ['display--block'],
    'small',
  );

  const dtRatingClasses = prefixUtilityClasses(['margin-right--0p5']);

  const classes = [
    ...disabilityRatingClasses,
    ...disabilityRatingClassesMedium,
    ...disabilityRatingClassesSmall,
  ].join(' ');

  return (
    <div className={classes}>
      <dt className={rating ? dtRatingClasses : null}>
        {rating ? `Your disability rating:` : null}
      </dt>
      <dd>
        <a
          href="/disability/view-disability-rating/rating"
          aria-label={
            rating
              ? `View your ${rating}% service connected disability rating`
              : 'view your disability rating'
          }
          className="vads-u-color--white"
          style={{ whiteSpace: 'nowrap' }}
        >
          <strong>
            {rating
              ? `${rating}% service connected`
              : 'View disability rating '}
          </strong>
          <i
            aria-hidden="true"
            role="img"
            className="fas fa-chevron-right vads-u-padding-left--0p5"
          />
        </a>
      </dd>
    </div>
  );
};

DisabilityRatingContent.propTypes = {
  rating: PropTypes.number,
};

const DisabilityRating = ({ rating, showFallbackLink }) => {
  if (showFallbackLink) {
    return <DisabilityRatingContent />;
  }

  if (rating) {
    return <DisabilityRatingContent rating={rating} />;
  }

  return null;
};

DisabilityRating.propTypes = {
  rating: PropTypes.number,
  showFallbackLink: PropTypes.bool,
};

const NameTag = ({
  userFullName: { first, middle, last, suffix },
  latestBranchOfService,
  showBadgeImage,
  totalDisabilityRating,
  totalDisabilityRatingServerError,
}) => {
  const fullName = formatFullName({ first, middle, last, suffix });

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
    'padding-x--2',
  ]);
  const innerWrapperClassesMedium = prefixUtilityClasses(
    ['flex-direction--row'],
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
    'line-height--3',
    'margin--0',
    'text-align--center',
  ]);
  const latestBranchClassesMedium = prefixUtilityClasses(
    ['text-align--left'],
    'medium',
  );

  const classes = {
    wrapper: [...updatedWrapperClasses, ...wrapperClassesMedium].join(' '),
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

  const ariaLabel = 'My information';

  return (
    <section
      aria-label={ariaLabel}
      className={classes.wrapper}
      data-testid="name-tag"
      role="banner"
    >
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
              <>
                <dt className="sr-only">Branch of service: </dt>
                <dd className={classes.latestBranch}>
                  {getServiceBranchDisplayName(latestBranchOfService)}
                </dd>
              </>
            )}
            <DisabilityRating
              rating={totalDisabilityRating}
              showFallbackLink={totalDisabilityRatingServerError}
            />
          </dl>
        </div>
      </div>
    </section>
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
  latestBranchOfService: PropTypes.string,
  showBadgeImage: PropTypes.bool,
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

export default connect(mapStateToProps)(NameTag);
