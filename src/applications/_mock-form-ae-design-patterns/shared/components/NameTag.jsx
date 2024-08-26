import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';
import { selectProfile } from '~/platform/user/selectors';
import { normalizeFullName } from '../../utils/helpers/general';

const placeholderBranchImg = '/img/vic-army-symbol.png';

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

const dtRatingClasses = prefixUtilityClasses(['margin-right--0p5'], 'medium');

const DisabilityRatingContent = ({ rating }) => {
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
          className="vads-u-color--white medium-screen:vads-u-margin-top--neg0p25 medium-screen:vads-u-margin-left--0 vads-u-margin-left--2"
          style={{ whiteSpace: 'nowrap' }}
        >
          <strong>
            {rating
              ? `${rating}% service connected`
              : 'View disability rating '}
          </strong>
          <va-icon
            icon="chevron_right"
            size="3"
            style={{ position: 'relative', top: '-1px' }}
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

const NameTag = ({ totalDisabilityRatingServerError }) => {
  const fullName = useSelector(selectProfile)?.userFullName;
  const formattedFullName = normalizeFullName(fullName, true);

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
    >
      <div className={classes.innerWrapper}>
        <div className={classes.serviceBadge}>
          <img
            src={placeholderBranchImg}
            alt="Army seal"
            className="vads-u-padding-right--3"
            style={{ maxHeight: '75px' }}
          />
        </div>
        <div>
          <dl className="vads-u-margin-y--0">
            <dt className="sr-only">Name: </dt>
            <dd className={classes.fullName}>{formattedFullName}</dd>
            <dt className="sr-only">Branch of service: </dt>
            <dd className={classes.latestBranch}>United States Army</dd>

            <DisabilityRating
              rating={40}
              showFallbackLink={totalDisabilityRatingServerError}
            />
          </dl>
        </div>
      </div>
    </section>
  );
};

NameTag.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
};

export default NameTag;
