import React from 'react';
import moment from 'moment';
import { USA_MILITARY_BRANCHES } from './constants';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const asyncFetchMilitaryInformation = () =>
  asyncReturn({
    serviceHistory: [
      {
        branchOfService: 'Army',
        beginDate: '2010-05-10',
        endDate: '2010-08-15',
      },
      {
        branchOfService: 'Air Force',
        beginDate: '2010-01-31',
        endDate: '2010-03-01',
      },
      {
        branchOfService: 'Other',
        beginDate: '2011-02-28',
        endDate: '2011-12-25',
      },
      {
        branchOfService: 'Marine Corps',
        beginDate: '2012-04-01',
        endDate: '2012-05-01',
      },
    ],
  });

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
  if (Object.values(USA_MILITARY_BRANCHES).includes(serviceBranch)) {
    return `United States ${serviceBranch}`;
  }
  return serviceBranch;
};

/**
 *
 * Transforms a service history object into an object with `title` and `value`
 * keys, which is the format required by a single row in a `ProfileInfoTable`
 *
 * @param {Object} entry - a service history object with `branchOfService`,
 * `beginDate`, and `endDate` keys
 * @returns {Object} An object with `title` and `value` keys
 */
export const transformServiceHistoryEntryIntoTableRow = entry => ({
  title: (
    <>
      <dfn className="sr-only">Service branch: </dfn>
      {getServiceBranchDisplayName(entry.branchOfService)}
    </>
  ),
  value: (
    <>
      <dfn className="sr-only">Dates of service: </dfn>
      {moment(entry.beginDate).format('LL')} –{' '}
      {moment(entry.endDate).format('LL')}
    </>
  ),
});
