import React from 'react';
import { addHours, isBetween, differenceInHours, parseJSON } from 'date-fns';

import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import { SERVICE_PROVIDERS } from './constants';

export const AUTH_DEPENDENCIES = [
  EXTERNAL_SERVICES.idme,
  EXTERNAL_SERVICES.ssoe,
  EXTERNAL_SERVICES.dslogon,
  EXTERNAL_SERVICES.mhv,
  EXTERNAL_SERVICES.mvi,
  EXTERNAL_SERVICES.logingov,
];

export const generateCSPBanner = ({ csp }) => {
  return {
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
  ...Object.keys(SERVICE_PROVIDERS).reduce(
    (acc, cv) => ({
      ...acc,
      [cv]: generateCSPBanner({ csp: cv }),
    }),
    {},
  ),
  ssoe: {
    headline: 'Our sign in process isn’t working right now',
    status: 'error',
    message:
      'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
  },
  mvi: {
    headline: 'You may have trouble signing in or using some tools or services',
    status: 'warning',
    message:
      'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
  },
  maintenance: {
    headline: 'Site maintenance',
    status: 'warning',
  },
};

export const createMaintenanceBanner = ({
  start_time: startTime,
  end_time: endTime,
}) => {
  const { headline, status } = DOWNTIME_BANNER_CONFIG.maintenance;

  const startsAt = parseJSON(startTime);
  const expiresAt = parseJSON(endTime);
  const hours = differenceInHours(expiresAt, startsAt);
  const timeFrame = `hour${hours > 1 ? 's' : ''}`;
  const message = (
    <p>
      We’ll be doing some work on VA.gov. The maintenance will last {hours}
      {timeFrame}. During that time, you won’t be able to sign in or use tools.
    </p>
  );
  return {
    headline,
    status,
    message,
  };
};

export const renderServiceDown = service => {
  const { status, headline, message } =
    DOWNTIME_BANNER_CONFIG[service] ?? DOWNTIME_BANNER_CONFIG.mvi;
  return (
    <div className="form-warning-banner fed-warning--v2">
      <va-alert visible status={status} uswds>
        <h2 slot="headline">{headline}</h2>
        {message}
      </va-alert>
    </div>
  );
};

const checkTime = maint => {
  const startsAt = addHours(parseJSON(maint.start_time), 1);
  const endsAt = parseJSON(maint.end_time);
  // const ready = isBetween(startsAt, endsAt);

  // console.log({ service: maint.external_service, ready, startsAt });
  return isBetween(startsAt, endsAt);
};

export const isUpcoming = maintArr => {
  return maintArr.some(maint => {
    return (
      ['global', ...AUTH_DEPENDENCIES].includes(maint.external_service) &&
      checkTime(maint)
    );
  });
};

const serviceCheck = svc =>
  AUTH_DEPENDENCIES.includes(svc.serviceId) && svc.status !== 'active';

export const isDepedencyDown = serviceArr => serviceArr.some(serviceCheck);

export const generateMaintenanceBanner = maintArray => {
  return maintArray.reduce((banner, item) => {
    if (AUTH_DEPENDENCIES.includes(item.externalService)) {
      return { ...banner, item };
    }
    return { ...banner, item };
  }, {});
};

export const renderMaintenanceWindow = maint => {
  const maintenanceBanner = createMaintenanceBanner(maint);
  return renderServiceDown(maintenanceBanner);
};

export const generateDowntimeStatus = statusArray =>
  statusArray?.find(serviceCheck)?.serviceId;
