import React from 'react';
import {
  subHours,
  isWithinInterval,
  parseJSON,
  isValid,
  format,
  differenceInHours,
} from 'date-fns';
import { format as fmtTZ } from 'date-fns-tz';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import { SERVICE_PROVIDERS } from './constants';

export const CSP_DEPENDENCIES = [
  EXTERNAL_SERVICES.idme,
  EXTERNAL_SERVICES.dslogon,
  EXTERNAL_SERVICES.logingov,
];

export const AUTH_DEPENDENCIES = [
  ...CSP_DEPENDENCIES,
  EXTERNAL_SERVICES.ssoe,
  EXTERNAL_SERVICES.mvi,
];

export const generateCSPBanner = ({ csp }) => {
  return csp === 'idme'
    ? {
        headline: `You may have trouble signing in with some of your accounts`,
        status: 'warning',
        message: `We’re sorry. We’re working to fix some problems with ID.me, but you can still sign in to VA.gov using your Login.gov account. If you’d like to sign in with your ID.me account, please check back later.`,
      }
    : {
        headline: `You may have trouble signing in with ${
          SERVICE_PROVIDERS[csp].label
        }`,
        status: 'warning',
        message: `We’re sorry. We’re working to fix some problems with our ${
          SERVICE_PROVIDERS[csp].label
        } sign in process. If you’d like to sign in to VA.gov with your ${
          SERVICE_PROVIDERS[csp].label
        } account, please check back later.`,
      };
};

export const DOWNTIME_BANNER_CONFIG = {
  ...CSP_DEPENDENCIES.reduce(
    (acc, cv) => ({
      ...acc,
      [cv]: generateCSPBanner({ csp: cv }),
    }),
    {},
  ),
  ssoe: {
    headline: 'Our sign in process isn’t working right now',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
  },
  multipleServices: {
    headline: 'You may have trouble signing in or using some tools or services',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix a problem that affects our site. If you have trouble signing in or using any tools or services, please check back soon.',
  },
  mvi: {
    headline: 'You may have trouble signing in or using some tools or services',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
  },
  maintenance: {
    headline: 'Upcoming site maintenance',
    status: 'info',
  },
};

const serviceCheck = ({ serviceId, status }) =>
  AUTH_DEPENDENCIES.includes(serviceId) && status !== 'active';

/**
 *
 * @param {String} service - A singular auth dependency inside AUTH_DEPENDENCIES
 * @returns A React-node (va-alert)
 */
export const renderServiceDown = service => {
  const { status, headline, message } =
    typeof service === 'string'
      ? DOWNTIME_BANNER_CONFIG[service] ?? DOWNTIME_BANNER_CONFIG.mvi
      : service;
  return (
    <div className="form-warning-banner fed-warning--v2">
      <va-alert visible status={status} uswds>
        <h2 slot="headline">{headline}</h2>
        {message}
      </va-alert>
    </div>
  );
};

export const renderDowntimeBanner = statuses => {
  const areMultipleServicesDown = statuses?.filter(serviceCheck).length > 1;
  const downedService = areMultipleServicesDown
    ? { serviceId: 'multipleServices' }
    : statuses?.find(serviceCheck);
  return !downedService ? null : renderServiceDown(downedService.serviceId);
};

/**
 *
 * @param {Object} - A single object from a maintenance window (destructured start & end times)
 * @returns An object needed to create the React-node (va-alert) maintenance banner
 */
export const createMaintenanceBanner = ({
  startTime: startingTime,
  endTime: endingTime,
}) => {
  const { headline, status } = DOWNTIME_BANNER_CONFIG.maintenance;

  const startTime = parseJSON(startingTime);
  const startDate = format(startTime, `PPPP`);
  const endTime = parseJSON(endingTime);
  const hours = differenceInHours(endTime, startTime);
  const howLongMaintLasts = `${hours} hour${hours > 1 ? 's' : ''}`;

  if (!isValid(startTime) || !isValid(endTime)) {
    return null;
  }

  const startsAt = format(startTime, `h:mm bbbb`);
  const endsAt = fmtTZ(endTime, `h:mm bbbb z`);

  const message = (
    <>
      <p>
        We’ll be working on VA.gov soon. The maintenance will last about{' '}
        {howLongMaintLasts}. During this time, you won’t be able to sign in, use
        online tools, or access VA.gov webpages.
      </p>
      <p>
        <strong>Date:</strong> {startDate}
      </p>
      <p>
        <strong>Start and end time:</strong> {startsAt} and {endsAt}
      </p>
    </>
  );
  return { headline, status, message, startTime, endTime };
};

/**
 *
 * @param {Array} maintArray - `maintenance_windows` array from API response
 * @returns An object of the first maintenance window meeting our criteria
 */
export const determineMaintenance = maintArray =>
  maintArray.find(maintService =>
    ['global', ...AUTH_DEPENDENCIES].includes(maintService.externalService),
  );

/**
 *
 * @param {ISODateString} startTime
 * @param {ISODateString} endTime
 * @returns Boolean (true/false) based on if the times are within the maintenance window
 */
export const isInMaintenanceWindow = (startTime, endTime) => {
  const start = subHours(parseJSON(startTime), 2);
  const end = parseJSON(endTime);

  const currentTime = new Date();

  return isWithinInterval(currentTime, { start, end });
};

/**
 *
 * @param {Array} maintArray - `maintenance_windows` array from API response
 * @returns A React-node (va-alert) of the maintenance window when inside a maintenance window otherwise it returns null
 */
export const renderMaintenanceWindow = maintArray => {
  if (!maintArray || maintArray.length <= 0) {
    return null;
  }

  const bannerOptions = determineMaintenance(maintArray);
  if (!bannerOptions) return null;

  const maintenanceBanner = createMaintenanceBanner(bannerOptions);

  return maintenanceBanner &&
    isInMaintenanceWindow(
      maintenanceBanner.startTime,
      maintenanceBanner.endTime,
    )
    ? renderServiceDown(maintenanceBanner)
    : null;
};
