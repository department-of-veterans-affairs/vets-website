import camelCaseKeysRecursive from 'camelcase-keys-recursive';
import moment from 'moment';

import environment from 'platform/utilities/environment';
import ENVIRONMENTS from 'site/constants/environments';

import externalServiceStatus from '../config/externalServiceStatus';
import defaultExternalServices from '../config/externalServices';

/**
 * Derives downtime status based on a time range
 * @param {string|Date|Moment} startTime
 * @param {string|Date|Moment} endTime
 * @returns {string} A service status
 */
export function getStatusForTimeframe(startTime, endTime) {
  const now = moment();
  const hasStarted = now.isSameOrAfter(startTime);

  if (hasStarted) {
    // Check for indefinite downtime (null endTime) or that the endTime is in the future
    if (!endTime || now.isBefore(endTime)) {
      return externalServiceStatus.down;
    }
    // The downtime must be old and outdated. The API should filter these so this shouldn't happen.
    return externalServiceStatus.ok;
  }

  const startsWithinHour = now.add(1, 'hour').isSameOrAfter(startTime);
  if (startsWithinHour) return externalServiceStatus.downtimeApproaching;

  return externalServiceStatus.ok;
}

export function createGlobalMaintenanceWindow({
  startTime,
  endTime,
  externalServices = defaultExternalServices,
}) {
  return [
    {
      attributes: {
        externalService: 'global',
        startTime,
        endTime,
      },
    },
    ...Object.keys(externalServices).map(externalService => ({
      attributes: {
        externalService,
        startTime,
        endTime,
      },
    })),
  ];
}

/**
 * Creates a Map of downtime information using the "externalService" property as keys
 * @param {Array} maintenanceWindows The raw JSON data from the API
 * @returns {Map}
 */
export function createServiceMap(maintenanceWindows = []) {
  const serviceMap = new Map();

  for (const maintenanceWindow of maintenanceWindows) {
    const {
      attributes: {
        externalService,
        startTime: startTimeRaw,
        endTime: endTimeRaw,
      },
    } = maintenanceWindow;

    const startTime = moment(startTimeRaw);
    const endTime = endTimeRaw && moment(endTimeRaw);
    const status = getStatusForTimeframe(startTime, endTime);

    serviceMap.set(externalService, {
      externalService,
      status,
      startTime,
      endTime,
    });
  }

  return serviceMap;
}

/**
 * Determines the downtime with the soonest startTime by using a service map to look up downtime information for each service in a list of service names
 * @param {Map} serviceMap A Map as created by createServiceMap
 * @param {Array<string>} serviceNames A list of external services
 * @returns {object} A downtime object containing properties "externalService", "status", "startTime", and "endTime"
 */
export function getSoonestDowntime(serviceMap, serviceNames) {
  return serviceNames
    .map(serviceName => serviceMap.get(serviceName))
    .filter(service => !!service)
    .filter(service => service.status !== externalServiceStatus.ok)
    .reduce((mostUrgentService, service) => {
      if (!mostUrgentService) return service;
      return mostUrgentService.startTime.isBefore(service.startTime)
        ? mostUrgentService
        : service;
    }, null);
}

/**
 * Determines the global downtime window that includes the current time
 * @returns {object} A global downtime window that covers the current time
 *     if it exists and null if not
 */
export const getCurrentGlobalDowntime = (() => {
  const BUCKET_BASE_URL = 's3-us-gov-west-1.amazonaws.com';

  const MAINTENANCE_WINDOWS_SUBDOMAIN = Object.freeze({
    [ENVIRONMENTS.VAGOVDEV]: 'dev-va-gov-maintenance-windows',
    [ENVIRONMENTS.VAGOVSTAGING]: 'staging-va-gov-maintenance-windows',
    [ENVIRONMENTS.VAGOVPROD]: 'prod-va-gov-maintenance-windows',
  });

  const MAINTENANCE_WINDOWS_JSON = `https://${
    MAINTENANCE_WINDOWS_SUBDOMAIN[environment.BUILDTYPE]
  }.${BUCKET_BASE_URL}/maintenance_windows.json`;

  const includesCurrentTime = ({ startTime, endTime }) =>
    !environment.isLocalhost() &&
    moment().isAfter(startTime) &&
    moment().isBefore(endTime);

  return async () => {
    try {
      const response = await fetch(MAINTENANCE_WINDOWS_JSON);
      const data = camelCaseKeysRecursive(await response.json());
      return data.find(includesCurrentTime) || null;
    } catch (error) {
      return null;
    }
  };
})();
