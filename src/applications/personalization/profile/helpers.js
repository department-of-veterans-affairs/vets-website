import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PROFILE_PATHS, USA_MILITARY_BRANCHES } from './constants';

/**
 * Prefixes the serviceBranch with 'United States' if it's a valid US military
 * branch. Otherwise it returns the original serviceBranch without changing it
 *
 * @param {string} serviceBranch - the branch to potentially prefix with 'United
 * States'
 * @returns {string} the service branch with or without 'United States'
 * prepended to it
 *
 */
export const getServiceBranchDisplayName = serviceBranch => {
  if (!serviceBranch) return 'Unknown branch of service';
  if (Object.values(USA_MILITARY_BRANCHES).includes(serviceBranch)) {
    return `United States ${serviceBranch}`;
  }
  return serviceBranch;
};

const VALID_PERIOD_OF_SERVICE_TYPES = ['A', 'V'];

const ServicePeriodText = ({
  periodOfServiceTypeCode,
  periodOfServiceTypeText,
}) => {
  if (
    periodOfServiceTypeCode &&
    periodOfServiceTypeText &&
    VALID_PERIOD_OF_SERVICE_TYPES.includes(periodOfServiceTypeCode)
  ) {
    return <p className="vads-u-margin-y--0">{periodOfServiceTypeText}</p>;
  }
  return null;
};

ServicePeriodText.propTypes = {
  periodOfServiceTypeCode: PropTypes.string,
  periodOfServiceTypeText: PropTypes.string,
};

/**
 *
 * Transforms a service history object into an object with `title` and `value`
 * keys, which is the format required by a single row in a `ProfileInfoCard`
 *
 * @param {Object} entry - a service history object with `branchOfService`,
 * `beginDate`, and `endDate` keys
 * @returns {Object} An object with `title` and `value` keys
 */
export const transformServiceHistoryEntryIntoTableRow = entry => {
  const formattedBeginDate = entry.beginDate
    ? moment(entry.beginDate).format('LL')
    : '';
  const formattedEndDate = entry.endDate
    ? moment(entry.endDate).format('LL')
    : '';
  const dateRange =
    formattedBeginDate.length || formattedEndDate.length
      ? `${formattedBeginDate} – ${formattedEndDate}`
      : '';
  return {
    title: (
      <>
        <dfn className="sr-only">Service branch: </dfn>
        {getServiceBranchDisplayName(entry.branchOfService)}
      </>
    ),
    value: (
      <>
        <ServicePeriodText
          periodOfServiceTypeCode={entry?.periodOfServiceTypeCode}
          periodOfServiceTypeText={entry?.periodOfServiceTypeText}
        />
        <dfn className="sr-only">Dates of service: </dfn>
        {dateRange}
      </>
    ),
  };
};

export const getContactEditLinkURL = fieldName =>
  `${PROFILE_PATHS.EDIT}?fieldName=${fieldName}`;

export const handleRouteChange = (event, history) => {
  event.preventDefault();
  history.push(event.target.href);
};
