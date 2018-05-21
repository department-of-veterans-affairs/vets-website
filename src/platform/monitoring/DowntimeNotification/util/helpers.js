import moment from 'moment';
import serviceStatus from '../config/serviceStatus';

export function getStatusForTimeframe(startTime, endTime) {
  const now = moment();
  const hasStarted = now.isSameOrAfter(startTime);

  if (hasStarted) {
    // Check for indefinite downtime (null endTime) or that the endTime is in the future
    if (!endTime || now.isBefore(endTime)) {
      return serviceStatus.down;
    }
    // The downtime must be old and outdated. The API should filter these so this shouldn't happen.
    return serviceStatus.ok;
  }

  const startsWithinHour = now.add(1, 'hour').isSameOrAfter(startTime);
  if (startsWithinHour) return serviceStatus.downtimeApproaching;

  return serviceStatus.ok;
}

export function createServiceMap(maintenanceWindows = []) {
  const serviceMap = new Map();

  for (const maintenanceWindow of maintenanceWindows) {
    const {
      attributes: {
        externalService,
        startTime: startTimeRaw,
        endTime: endTimeRaw
      }
    } = maintenanceWindow;

    const startTime = moment(startTimeRaw);
    const endTime = endTimeRaw && moment(endTimeRaw);
    const status = getStatusForTimeframe(startTime, endTime);

    serviceMap.set(externalService, {
      externalService,
      status,
      startTime,
      endTime
    });
  }

  return serviceMap;
}

export function getSoonestDowntime(serviceMap, serviceNames) {
  return serviceNames
    .map(serviceName => serviceMap.get(serviceName))
    .filter(service => !!service)
    .filter(service => service.status !== serviceStatus.ok)
    .reduce((mostUrgentService, service) => {
      if (!mostUrgentService) return service;
      return mostUrgentService.startTime.isBefore(service.startTime) ? mostUrgentService : service;
    }, null);
}
