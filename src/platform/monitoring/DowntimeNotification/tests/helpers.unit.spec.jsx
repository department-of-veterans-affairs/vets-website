import { expect } from 'chai';
import { subDays, subHours, subMinutes, addDays, addMinutes } from 'date-fns';

import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import externalServiceStatus from '../config/externalServiceStatus';
import defaultExternalServices from '../config/externalServices';
import * as downtimeHelpers from '../util/helpers';

function generateDowntimeWindows() {
  const now = new Date();

  const pastDowntime = {
    attributes: {
      externalService: 'dslogon',
      startTime: subHours(now, 1)?.toISOString(),
      endTime: subMinutes(now, 1)?.toISOString(),
    },
  };

  const futureDowntimeForSameService = {
    attributes: {
      externalService: 'evss',
      startTime: addDays(now, 1)?.toISOString(),
      endTime: addDays(now, 2)?.toISOString(),
    },
  };

  const activeDowntime = {
    attributes: {
      externalService: 'evss',
      startTime: subDays(now, 1)?.toISOString(),
      endTime: addDays(now, 1)?.toISOString(),
    },
  };

  const distantFutureDowntime = {
    attributes: {
      externalService: 'vic',
      startTime: addDays(now, 1)?.toISOString(),
      endTime: addDays(now, 2)?.toISOString(),
    },
  };

  const approachingDowntime = {
    attributes: {
      externalService: 'mvi',
      startTime: addMinutes(now, 20)?.toISOString(),
      endTime: addDays(now, 1)?.toISOString(),
    },
  };

  const lessUrgentApproachingDowntime = {
    attributes: {
      externalService: 'appeals',
      startTime: addMinutes(now, 45)?.toISOString(),
      endTime: addDays(now, 1)?.toISOString(),
    },
  };

  return {
    pastDowntime,
    activeDowntime,
    futureDowntimeForSameService,
    distantFutureDowntime,
    approachingDowntime,
    lessUrgentApproachingDowntime,
  };
}

describe('getStatusForTimeframe', () => {
  it('assigns a status according to timeframe', () => {
    const {
      pastDowntime,
      activeDowntime,
      distantFutureDowntime,
      approachingDowntime,
      lessUrgentApproachingDowntime,
    } = generateDowntimeWindows();
    expect(
      downtimeHelpers.getStatusForTimeframe(
        pastDowntime.attributes.startTime,
        pastDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.ok);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        activeDowntime.attributes.startTime,
        activeDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.down);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        approachingDowntime.attributes.startTime,
        approachingDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        lessUrgentApproachingDowntime.attributes.startTime,
        lessUrgentApproachingDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        distantFutureDowntime.attributes.startTime,
        distantFutureDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.ok);
  });
});

describe('createGlobalMaintenanceWindow', () => {
  const startTime = '2020-01-15 12:01';
  const endTime = '2020-01-16 12:01';
  const globalWindow = {
    attributes: {
      externalService: 'global',
      startTime,
      endTime,
    },
  };

  it('generates a "/maintenance_windows" response for each downed service', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
      externalServices: { mvi: 'mvi' },
    });

    expect(globalMaintWindow.length).to.eql(2);
    expect(globalMaintWindow[0]).to.eql(globalWindow);
    expect(globalMaintWindow[1]).to.eql({
      attributes: {
        externalService: 'mvi',
        startTime,
        endTime,
      },
    });
  });

  it('uses the default external services when none are provided', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
    });

    // The +1 is to account for the global service
    expect(globalMaintWindow.length).to.eql(
      Object.keys(defaultExternalServices).length + 1,
    );
  });
});

describe('createServiceMap', () => {
  let serviceMap;

  before(() => {
    const maintenanceWindows = Object.values(generateDowntimeWindows());
    serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
  });

  it('creates a map using the attributes.externalService property as keys', () => {
    const { evss } = serviceMap;
    const { vic } = serviceMap;
    const { mvi } = serviceMap;
    const { appeals } = serviceMap;

    expect(evss.status).to.equal(externalServiceStatus.down);
    expect(vic.status).to.equal(externalServiceStatus.ok);
    expect(mvi.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(appeals.status).to.equal(externalServiceStatus.downtimeApproaching);
  });
});

describe('getMostUrgentDowntime', () => {
  let serviceMap = null;

  before(() => {
    const maintenanceWindows = Object.values(generateDowntimeWindows());
    serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
  });

  it('returns null when all services are ok', () => {
    expect(downtimeHelpers.getSoonestDowntime(serviceMap, ['dslogon', 'vic']))
      .to.be.null;
  });

  it('returns the status with the soonest startTime and endTime that is not in the past', () => {
    const evss = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'evss',
      'vic',
      'mvi',
    ]);
    expect(evss.status).to.equal(externalServiceStatus.down);
    expect(evss.externalService).to.equal('evss');

    const mvi = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'mvi',
      'appeals',
    ]);
    expect(mvi.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(mvi.externalService).to.equal('mvi');

    const appeals = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'appeals',
    ]);
    expect(appeals.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(appeals.externalService).to.equal('appeals');
  });
});

describe('getCurrentGlobalDowntime', () => {
  beforeEach(() => {
    mockFetch();
  });

  it('returns downtime when in the middle of a downtime', async () => {
    const {
      pastDowntime,
      activeDowntime,
      distantFutureDowntime,
    } = generateDowntimeWindows();
    const response = [
      {
        startTime: pastDowntime.attributes.startTime,
        endTime: pastDowntime.attributes.endTime,
      },
      {
        startTime: activeDowntime.attributes.startTime,
        endTime: activeDowntime.attributes.endTime,
      },
      {
        startTime: distantFutureDowntime.attributes.startTime,
        endTime: distantFutureDowntime.attributes.endTime,
      },
    ];

    setFetchJSONResponse(global.fetch, response);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime.startTime).to.equal(response[1].startTime);
    expect(downtime.endTime).to.equal(response[1].endTime);
  });

  it('returns null when not within any downtimes', async () => {
    const { pastDowntime, distantFutureDowntime } = generateDowntimeWindows();
    const response = [
      {
        startTime: pastDowntime.attributes.startTime,
        endTime: pastDowntime.attributes.endTime,
      },
      {
        startTime: distantFutureDowntime.attributes.startTime,
        endTime: distantFutureDowntime.attributes.endTime,
      },
    ];

    setFetchJSONResponse(global.fetch, response);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime).to.be.null;
  });

  it('returns null when there are no downtimes', async () => {
    setFetchJSONResponse(global.fetch, []);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime).to.be.null;
  });

  it('returns null when failing to get downtimes', async () => {
    setFetchJSONFailure(global.fetch, null);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime).to.be.null;
  });
});
