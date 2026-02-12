import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

import {
  VaCard,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory } from 'react-router-dom';
import {
  PROFILE_PATH_NAMES,
  PROFILE_PATHS,
  SERVICE_BADGE_IMAGE_PATHS,
  VA_SEAL_IMAGE_PATH,
} from '../../constants';
import { getServiceBranchDisplayName, handleRouteChange } from '../../helpers';
import { formatFullName } from '../../../common/helpers';

const NameTag = ({
  userFullName: { first, middle, last, suffix },
  latestBranchOfService,
}) => {
  const history = useHistory();

  const fullName = formatFullName({ first, middle, last, suffix });

  const wrapperClasses = prefixUtilityClasses([
    'align-items--center',
    'display--flex',
    'flex-direction--row',
    'width--full',
    'padding--2',
  ]);

  const serviceBadgeClasses = prefixUtilityClasses([
    'display--flex',
    'justify-content--flex-end',
    'margin-bottom--0',
  ]);

  const titleClasses = prefixUtilityClasses([
    'display--none',
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'margin-bottom--2',
    'margin-top--0',
  ]);

  const fullNameClasses = prefixUtilityClasses([
    'font-family--serif',
    'font-size--h3',
    'font-weight--bold',
    'line-height--3',
    'margin-top--0',
  ]);

  const latestBranchClasses = prefixUtilityClasses([
    'font-family--sans',
    'font-size--base',
    'font-weight--normal',
    'line-height--3',
    'margin--0',
  ]);

  const classes = {
    wrapper: [...wrapperClasses, 'usa-grid', 'usa-grid-full'].join(' '),
    serviceBadge: [...serviceBadgeClasses].join(' '),
    title: [...titleClasses].join(' '),
    fullName: [...fullNameClasses].join(' '),
    latestBranch: [...latestBranchClasses].join(' '),
  };

  const sealSrc =
    SERVICE_BADGE_IMAGE_PATHS.get(latestBranchOfService) || VA_SEAL_IMAGE_PATH;
  const sealAlt = SERVICE_BADGE_IMAGE_PATHS.has(latestBranchOfService)
    ? `${getServiceBranchDisplayName(latestBranchOfService)} seal`
    : 'VA seal';

  const ariaLabel = 'My information';

  return (
    <VaCard
      aria-label={ariaLabel}
      data-testid="name-tag"
      className={classes.wrapper}
    >
      <div className={classes.serviceBadge}>
        <img
          src={sealSrc}
          alt={sealAlt}
          className="vads-u-padding-right--3"
          style={{ maxHeight: '75px' }}
        />
      </div>
      <div>
        <dl className="vads-u-margin-y--0 dd-privacy-mask">
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
        </dl>
        <VaLink
          active
          className="vads-u-display--block vads-u-margin-top--2"
          href={PROFILE_PATHS.VETERAN_STATUS_CARD}
          text={PROFILE_PATH_NAMES.VETERAN_STATUS_CARD}
          onClick={event => handleRouteChange(event, history)}
        />
      </div>
    </VaCard>
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
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

export default connect(mapStateToProps)(NameTag);
