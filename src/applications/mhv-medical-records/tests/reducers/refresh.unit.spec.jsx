import { expect } from 'chai';
import {
  safeNewDate,
  getPhase,
  getOverallPhase,
  refreshCompleted,
} from '../../reducers/refresh';
import {
  refreshPhases,
  refreshExtractTypes,
  VALID_REFRESH_DURATION,
} from '../../util/constants';

describe('safeNewDate', () => {
  it('should return a Date object for valid date strings', () => {
    const dateStr = '2024-01-10';
    const result = safeNewDate(dateStr);
    expect(result).to.be.an.instanceof(Date);
    expect(result.toISOString()).to.equal(new Date(dateStr).toISOString());
  });

  it('should return null for invalid date strings', () => {
    const invalidDateStr = 'invalid-date';
    const result = safeNewDate(invalidDateStr);
    expect(result).to.be.null;
  });
});

describe('getPhase', () => {
  it('should return null when extractStatus is invalid', () => {
    const result = getPhase(null, Date.now());
    expect(result).to.be.null;
  });

  it('should return null when retrieved timestamp is invalid', () => {
    const extractStatus = {
      lastRequested: Date.now(),
      lastCompleted: Date.now(),
      lastSuccessfulCompleted: Date.now(),
    };
    const result = getPhase(extractStatus, null);
    expect(result).to.be.null;
  });

  it('should return STALE if lastCompleted is more than VALID_REFRESH_DURATION ago', () => {
    const pastTime = Date.now() - VALID_REFRESH_DURATION - 1;
    const extractStatus = {
      lastRequested: pastTime,
      lastCompleted: pastTime,
      lastSuccessfulCompleted: pastTime,
    };
    const result = getPhase(extractStatus, Date.now());
    expect(result).to.equal(refreshPhases.STALE);
  });

  it('should return IN_PROGRESS if lastCompleted is before lastRequested', () => {
    const now = Date.now();
    const extractStatus = {
      lastRequested: now,
      lastCompleted: now - 1000,
      lastSuccessfulCompleted: now - 1000,
    };
    const result = getPhase(extractStatus, now);
    expect(result).to.equal(refreshPhases.IN_PROGRESS);
  });

  it('should return FAILED if lastCompleted is not equal to lastSuccessfulCompleted', () => {
    const now = Date.now();
    const extractStatus = {
      lastRequested: now - 1000,
      lastCompleted: now,
      lastSuccessfulCompleted: now - 1000,
    };
    const result = getPhase(extractStatus, now);
    expect(result).to.equal(refreshPhases.FAILED);
  });

  it('should return CURRENT for valid, successful, recent completion', () => {
    const now = Date.now();
    const extractStatus = {
      lastRequested: now - 1000,
      lastCompleted: now,
      lastSuccessfulCompleted: now,
    };
    const result = getPhase(extractStatus, now);
    expect(result).to.equal(refreshPhases.CURRENT);
  });
});

describe('getOverallPhase', () => {
  const now = Date.now();
  const pastTime = Date.now() - VALID_REFRESH_DURATION - 1;

  const currStatus = {
    extract: refreshExtractTypes.ALLERGY,
    lastRequested: now - 1000,
    lastCompleted: now,
    lastSuccessfulCompleted: now,
  };
  const staleStatus = {
    lastRequested: pastTime,
    lastCompleted: pastTime,
    lastSuccessfulCompleted: pastTime,
  };

  it('should return null if refreshStatus is empty or null', () => {
    expect(getOverallPhase([], 1234567890)).to.be.null;
    expect(getOverallPhase(null, 1234567890)).to.be.null;
  });

  it('should return IN_PROGRESS if any extract is IN_PROGRESS', () => {
    const refreshStatus = [
      {
        ...currStatus,
        extract: refreshExtractTypes.ALLERGY,
      },
      {
        extract: refreshExtractTypes.VPR,
        lastRequested: now, // IN_PROGRESS
        lastCompleted: now - 1000,
        lastSuccessfulCompleted: now - 1000,
      },
    ];
    const result = getOverallPhase(refreshStatus, Date.now());
    expect(result).to.equal(refreshPhases.IN_PROGRESS);
  });

  it('should return STALE if no extracts are IN_PROGRESS but at least one is STALE', () => {
    const refreshStatus = [
      {
        ...staleStatus,
        extract: refreshExtractTypes.ALLERGY,
      },
      {
        ...currStatus,
        extract: refreshExtractTypes.VPR,
      },
    ];
    const result = getOverallPhase(refreshStatus, Date.now());
    expect(result).to.equal(refreshPhases.STALE);
  });

  it('should return CURRENT if no extracts are IN_PROGRESS or STALE, and one is FAILED', () => {
    const refreshStatus = [
      {
        extract: refreshExtractTypes.ALLERGY,
        lastRequested: now - 1000, // FAILED
        lastCompleted: now,
        lastSuccessfulCompleted: now - 1000,
      },
      {
        ...currStatus,
        extract: refreshExtractTypes.VPR,
      },
    ];
    const result = getOverallPhase(refreshStatus, Date.now());
    expect(result).to.equal(refreshPhases.CURRENT);
  });

  it('should return CURRENT if all extracts are CURRENT', () => {
    const refreshStatus = [
      {
        ...currStatus,
        extract: refreshExtractTypes.ALLERGY,
      },
      {
        ...currStatus,
        extract: refreshExtractTypes.VPR,
      },
    ];
    const result = getOverallPhase(refreshStatus, Date.now());
    expect(result).to.equal(refreshPhases.CURRENT);
  });

  it('should return null if none of the extracts match the listed extracts', () => {
    const refreshStatus = [
      {
        ...currStatus,
        extract: 'UnknownExtract1',
      },
      {
        ...staleStatus,
        extract: 'UnknownExtract2',
      },
    ];
    const result = getOverallPhase(refreshStatus, Date.now());
    expect(result).to.be.null;
  });
});

describe('refreshCompleted', () => {
  it('should return the most recent completion date', () => {
    const statusList = [
      { extract: refreshExtractTypes.ALLERGY, lastCompleted: 1700000000000 },
      { extract: refreshExtractTypes.CHEM_HEM, lastCompleted: 1700000000002 },
      { extract: refreshExtractTypes.VPR, lastCompleted: 1700000000001 },
    ];
    const result = refreshCompleted(statusList);
    expect(result.getTime()).to.equal(1700000000002);
  });

  it('should return null for a list with irrelevant extract types', () => {
    const statusList = [
      { extract: 'Extract1', lastCompleted: 1700000000000 },
      { extract: 'Extract2', lastCompleted: 1700000000002 },
      { extract: 'Extract3', lastCompleted: 1700000000001 },
    ];
    const result = refreshCompleted(statusList);
    expect(result).to.be.null;
  });
});
