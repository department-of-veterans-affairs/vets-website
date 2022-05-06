import React, { useEffect, useState } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';
import moment from 'moment';

import { isServerError } from '../util';
import RatedDisabilityListItem from './RatedDisabilityListItem';
import SortSelect from './SortSelect';

// Need to transform date string into a meaningful format and extract any special issues.
const formalizeData = data => {
  return data.map(d => {
    const effectiveDate = d.effectiveDate
      ? moment(d.effectiveDate, 'YYYY-DD-MMThh:mm:ss.SSSZ')
      : null;

    return { ...d, effectiveDate };
  });
};

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
          <va-telephone contact={CONTACTS.VA_311} /> (TTY:{' '}
          <va-telephone contact={CONTACTS['711']} />
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

const RatedDisabilityList = props => {
  const [sortBy, setSortBy] = useState('effectiveDate.desc');

  useEffect(() => {
    props.fetchRatedDisabilities();
  }, []);

  const sortFunc = (a, b) => {
    const [sortKey, direction] = sortBy.split('.');

    return direction === 'asc'
      ? a[sortKey] - b[sortKey]
      : b[sortKey] - a[sortKey];
  };

  if (!props.ratedDisabilities) {
    return <va-loading-indicator message="Loading your information..." />;
  }

  if (
    props?.ratedDisabilities?.errors ||
    props?.ratedDisabilities?.ratedDisabilities.length === 0
  ) {
    // There are instances when a 200 response is received but evss sends an empty array.
    // In this scenario errorCode is explicitly set to 404 to ensure a defined value is passed to noDisabilityRatingContent
    const errorCode = props?.ratedDisabilities?.errors?.[0]?.code || 404;
    return (
      <div className="usa-width-one-whole">
        {noDisabilityRatingContent(errorCode)}
      </div>
    );
  }

  const formattedDisabilities = formalizeData(
    props?.ratedDisabilities?.ratedDisabilities,
  ).sort(sortFunc);

  return (
    <div>
      <h2 id="individual-ratings" className="vads-u-margin-y--1p5">
        Your individual ratings
      </h2>
      {props.sortToggle && (
        <div id="ratings-sort-select-ab" className="vads-u-margin-bottom--2">
          <SortSelect onSelect={setSortBy} sortBy={sortBy} />
        </div>
      )}
      <div className="vads-l-row">
        {formattedDisabilities.map((disability, index) => (
          <RatedDisabilityListItem ratedDisability={disability} key={index} />
        ))}
      </div>
    </div>
  );
};

RatedDisabilityList.propTypes = {
  fetchRatedDisabilities: PropTypes.func.isRequired,
  ratedDisabilities: PropTypes.shape({
    ratedDisabilities: PropTypes.array,
  }),
  sortToggle: PropTypes.bool,
};

export default RatedDisabilityList;
