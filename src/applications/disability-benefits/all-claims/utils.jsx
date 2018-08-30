// @flow
import * as React from 'react';
import moment from 'moment';

import get from '../../../platform/utilities/data/get';

import { RESERVE_GUARD_TYPES } from './constants';


// Would be good to pull these type definitions into a common file
type DateRangeType = {
  from: string,
  to: string
};

type FormDataType = {
  servicePeriods: Array<{
    serviceBranch: string,
    serviceHistory: Array<{}>,
    dateRange: DateRangeType,
  }>
};


/**
 * Show one thing, have a screen reader say another.
 *
 * @param srIgnored -- Thing to be displayed visually, but ignored by screen readers
 * @param substitutionText -- Text for screen readers to say instead of srIgnored
 */
const srSubstitute = (srIgnored: React.Node, substitutionText: string): React.Node => {
  return (
    <div style={{ display: 'inline' }}>
      <span aria-hidden>{srIgnored}</span>
      <span className="sr-only">{substitutionText}</span>
    </div>
  );
};

export default srSubstitute;

export const hasGuardOrReservePeriod = (formData: FormDataType): boolean => {
  const serviceHistory = formData.servicePeriods;
  if (!serviceHistory || !Array.isArray(serviceHistory)) {
    return false;
  }

  return serviceHistory.reduce((isGuardReserve, { serviceBranch }) => {
    // For a new service period, service branch defaults to undefined
    if (!serviceBranch) {
      return false;
    }
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return isGuardReserve
        || serviceBranch.includes(reserve)
        || serviceBranch.includes(nationalGuard);
  }, false);
};

export const ReservesGuardDescription = ({ formData }: { formData: FormDataType }): React.Node => {
  const { servicePeriods } = formData;
  if (!servicePeriods || !Array.isArray(servicePeriods) || !servicePeriods[0].serviceBranch) {
    return null;
  }

  const mostRecentPeriod = servicePeriods.filter(({ serviceBranch }) => {
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return (serviceBranch.includes(nationalGuard) || serviceBranch.includes(reserve));
  }).map(({ serviceBranch, dateRange }) => {
    const dateTo = new Date(dateRange.to);
    return {
      serviceBranch,
      to: dateTo
    };
  }).sort((periodA, periodB) => (periodB.to - periodA.to))[0];

  if (!mostRecentPeriod) {
    return null;
  }
  const { serviceBranch, to } = mostRecentPeriod;
  return (
    <div>
      Please tell us more about your {serviceBranch} service that ended on {moment(to).format('MMMM DD, YYYY')}.
    </div>
  );
};

export const title10DatesRequired = (formData: FormDataType): boolean => get('view:isTitle10Activated', formData, false);

export const isInFuture = (errors: { addError: (string) => mixed }, fieldData: string): void => {
  const enteredDate = new Date(fieldData);
  if (enteredDate < Date.now()) {
    errors.addError('Expected separation date must be in the future');
  }
};
