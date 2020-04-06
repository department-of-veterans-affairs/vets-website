import moment from 'moment';

import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  resetFetch,
} from 'platform/testing/unit/helpers';

import externalServiceStatus from '../config/externalServiceStatus';
import defaultExternalServices from '../config/externalServices';
import * as downtimeHelpers from '../util/helpers';

const pastDowntime = {
  attributes: {
    externalService: 'dslogon',
    startTime: moment()
      .subtract(1, 'hour')
      .toISOString(),
    endTime: moment()
      .subtract(1, 'minute')
      .toISOString(),
  },
};

const activeDowntime = {
  attributes: {
    externalService: 'evss',
    startTime: moment()
      .subtract(1, 'day')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const distantFutureDowntime = {
  attributes: {
    externalService: 'vic',
    startTime: moment()
      .add(1, 'day')
      .toISOString(),
    endTime: moment()
      .add(2, 'day')
      .toISOString(),
  },
};

const approachingDowntime = {
  attributes: {
    externalService: 'mvi',
    startTime: moment()
      .add(10, 'minute')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const lessUrgentApproachingDowntime = {
  attributes: {
    externalService: 'appeals',
    startTime: moment()
      .add(15, 'minute')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const maintenanceWindows = [
  pastDowntime,
  activeDowntime,
  distantFutureDowntime,
  approachingDowntime,
  lessUrgentApproachingDowntime,
];

describe('getStatusForTimeframe', () => {
  test('assigns a status according to timeframe', () => {
    expect(
      downtimeHelpers.getStatusForTimeframe(
        pastDowntime.attributes.startTime,
        pastDowntime.attributes.endTime,
      ),
    ).toBe(externalServiceStatus.ok);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        activeDowntime.attributes.startTime,
        activeDowntime.attributes.endTime,
      ),
    ).toBe(externalServiceStatus.down);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        approachingDowntime.attributes.startTime,
        approachingDowntime.attributes.endTime,
      ),
    ).toBe(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        lessUrgentApproachingDowntime.attributes.startTime,
        lessUrgentApproachingDowntime.attributes.endTime,
      ),
    ).toBe(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        distantFutureDowntime.attributes.startTime,
        distantFutureDowntime.attributes.endTime,
      ),
    ).toBe(externalServiceStatus.ok);
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

  test('generates a "/maintenance_windows" response for each downed service', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
      externalServices: { mvi: 'mvi' },
    });

    expect(globalMaintWindow.length).toBe(2);
    expect(globalMaintWindow[0]).toEqual(globalWindow);
    expect(globalMaintWindow[1]).toEqual({
      attributes: {
        externalService: 'mvi',
        startTime,
        endTime,
      },
    });
  });

  test('uses the default external services when none are provided', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
    });

    // The +1 is to account for the global service
    expect(globalMaintWindow.length).toEqual(
      Object.keys(defaultExternalServices).length + 1,
    );
  });
});

describe('createServiceMap', () => {
  test('creates a map using the attributes.externalService property as keys', () => {
    const serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
    const evss = serviceMap.get('evss');
    const vic = serviceMap.get('vic');
    const mvi = serviceMap.get('mvi');
    const appeals = serviceMap.get('appeals');

    expect(evss.status).toBe(externalServiceStatus.down);
    expect(vic.status).toBe(externalServiceStatus.ok);
    expect(mvi.status).toBe(externalServiceStatus.downtimeApproaching);
    expect(appeals.status).toBe(externalServiceStatus.downtimeApproaching);
  });
});

describe('getMostUrgentDowntime', () => {
  let serviceMap = null;

  beforeAll(() => {
    serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
  });

  test('returns null when all services are ok', () => {
    expect(
      downtimeHelpers.getSoonestDowntime(serviceMap, ['dslogon', 'vic']),
    ).toBeNull();
  });

  test('returns the status with the soonest startTime and endTime that is not in the past', () => {
    const evss = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'evss',
      'vic',
      'mvi',
    ]);
    expect(evss.status).toBe(externalServiceStatus.down);
    expect(evss.externalService).toBe('evss');

    const mvi = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'mvi',
      'appeals',
    ]);
    expect(mvi.status).toBe(externalServiceStatus.downtimeApproaching);
    expect(mvi.externalService).toBe('mvi');

    const appeals = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'appeals',
    ]);
    expect(appeals.status).toBe(externalServiceStatus.downtimeApproaching);
    expect(appeals.externalService).toBe('appeals');
  });
});

describe('getCurrentGlobalDowntime', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  test('returns downtime when in the middle of a downtime', async () => {
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
    expect(downtime.startTime).toBe(response[1].startTime);
    expect(downtime.endTime).toBe(response[1].endTime);
  });

  test('returns null when not within any downtimes', async () => {
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
    expect(downtime).toBeNull();
  });

  test('returns null when there are no downtimes', async () => {
    setFetchJSONResponse(global.fetch, []);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime).toBeNull();
  });

  test('returns null when failing to get downtimes', async () => {
    setFetchJSONFailure(global.fetch, null);
    const downtime = await downtimeHelpers.getCurrentGlobalDowntime();
    expect(downtime).toBeNull();
  });
});
