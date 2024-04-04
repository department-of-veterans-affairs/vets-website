import React, { useEffect, useState } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';

import { isServerError } from '../util';
import RatedDisabilityListItem from './RatedDisabilityListItem';
import SortSelect from './SortSelect';

const isServiceConnected = item => item.decisionText === 'Service Connected';

const getServiceConnectedDisabilities = list => list.filter(isServiceConnected);
const getNonServiceConnectedDisabilities = list =>
  list.filter(item => !isServiceConnected(item));

const noDisabilityRatingContent = errorCode => {
  let content;
  let status;

  if (isServerError(errorCode)) {
    status = 'error';
    content = (
      <>
        <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
          We’re sorry. Something went wrong on our end
        </h2>
        <p className="vads-u-font-size--base">
          Please refresh this page or check back later. You can also sign out of
          VA.gov and try signing back into this page.
        </p>
        <p className="vads-u-font-size--base">
          If you get this error again, please call the VA.gov help desk at{' '}
          <va-telephone contact={CONTACTS.VA_311} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </>
    );
  } else {
    status = 'info';
    content = (
      <>
        <h2 slot="headline" className="vads-u-margin-y--0 vads-u-font-size--h3">
          We don’t have rated disabilities on file for you
        </h2>
        <p className="vads-u-font-size--base">
          We can’t find any rated disabilities for you. If you have a disability
          that was caused by or got worse because of your service, you can file
          a claim for disability benefits.
        </p>
        <a
          href="/disability/how-to-file-claim/"
          className="vads-u-font-size--base usa-link"
          aria-label="Learn how to file a claim for disability compensation"
        >
          Learn how to file a claim for disability compensation
        </a>
      </>
    );
  }

  return (
    <div className="vads-u-margin-y--5">
      <va-alert status={status}>{content}</va-alert>
    </div>
  );
};

export default function RatedDisabilityList({
  fetchRatedDisabilities,
  ratedDisabilities,
  sortToggle,
}) {
  const [sortBy, setSortBy] = useState('effectiveDate.desc');

  useEffect(
    () => {
      fetchRatedDisabilities();
    },
    [fetchRatedDisabilities],
  );

  const sortFunc = (a, b) => {
    const [sortKey, direction] = sortBy.split('.');

    if (sortKey === 'ratingPercentage') {
      return direction === 'asc'
        ? a[sortKey] - b[sortKey]
        : b[sortKey] - a[sortKey];
    }

    return direction === 'asc'
      ? a[sortKey].localeCompare(b[sortKey])
      : b[sortKey].localeCompare(a[sortKey]);
  };

  if (!ratedDisabilities) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  if (
    ratedDisabilities?.errors ||
    ratedDisabilities?.ratedDisabilities.length === 0
  ) {
    // There are instances when a 200 response is received but evss sends an empty array.
    // In this scenario errorCode is explicitly set to 404 to ensure a defined value is passed to noDisabilityRatingContent
    const errorCode = ratedDisabilities?.errors?.[0]?.code || 404;
    return (
      <div className="usa-width-one-whole">
        {noDisabilityRatingContent(errorCode)}
      </div>
    );
  }

  const serviceConnected = getServiceConnectedDisabilities(
    ratedDisabilities?.ratedDisabilities,
  ).sort(sortFunc);
  const nonServiceConnected = getNonServiceConnectedDisabilities(
    ratedDisabilities?.ratedDisabilities,
  );

  return (
    <div>
      {sortToggle && (
        <div id="ratings-sort-select-ab" className="vads-u-margin-bottom--2">
          <SortSelect onSelect={setSortBy} sortBy={sortBy} />
        </div>
      )}
      <h3 className="vads-u-margin-y--2">Service-connected ratings</h3>
      <div className="vads-l-row vads-u-flex-direction--column">
        {serviceConnected.map((disability, index) => (
          <RatedDisabilityListItem ratedDisability={disability} key={index} />
        ))}
      </div>
      <h3 className="vads-u-margin-top--1p5">
        Conditions VA determined aren’t service-connected
      </h3>
      <div className="vads-l-row vads-u-flex-direction--column">
        {nonServiceConnected.map((disability, index) => (
          <RatedDisabilityListItem ratedDisability={disability} key={index} />
        ))}
      </div>
    </div>
  );
}

RatedDisabilityList.propTypes = {
  fetchRatedDisabilities: PropTypes.func.isRequired,
  ratedDisabilities: PropTypes.shape({
    errors: PropTypes.array,
    ratedDisabilities: PropTypes.array,
  }),
  sortToggle: PropTypes.bool,
};
