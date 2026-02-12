import { expect } from 'chai';
import { parseISO } from 'date-fns';
import {
  buildRadiologyResults,
  convertMhvRadiologyRecord,
  convertCvixRadiologyRecord,
  mergeRadiologyLists,
} from '../../util/imagesUtil';

describe('buildRadiologyResults', () => {
  const REPORT = 'The report.';
  const IMPRESSION = 'The impression.';

  it('builds the full result', () => {
    const record = {
      reportText: REPORT,
      impressionText: IMPRESSION,
    };
    const report = buildRadiologyResults(record);
    expect(report).to.include(REPORT);
    expect(report).to.include(IMPRESSION);
  });

  it('builds the result without impression', () => {
    const record = { reportText: REPORT };
    const report = buildRadiologyResults(record);
    expect(report).to.include(REPORT);
    expect(report).to.not.include(IMPRESSION);
  });

  it('builds the result without report', () => {
    const record = { impressionText: IMPRESSION };
    const report = buildRadiologyResults(record);
    expect(report).to.not.include(REPORT);
    expect(report).to.include(IMPRESSION);
  });
});

describe('Sort date', () => {
  it('matches for convertMhvRadiologyRecord', () => {
    const date = new Date();
    const dateIso = `${date.toISOString().split('.')[0]}Z`;
    const dateTimestamp = date.getTime();
    const compareDate = Math.floor(dateTimestamp / 1000) * 1000;

    const record = { eventDate: dateIso };
    const convertedRecord = convertMhvRadiologyRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(compareDate);
  });

  it('matches for convertCvixRadiologyRecord', () => {
    const date = new Date();
    const dateTimestamp = date.getTime();
    const compareDate = Math.floor(dateTimestamp / 1000) * 1000;

    const record = { performedDatePrecise: dateTimestamp };
    const convertedRecord = convertCvixRadiologyRecord(record);
    expect(parseISO(convertedRecord.sortDate).getTime()).to.eq(compareDate);
  });
});

describe('mergeRadiologyLists', () => {
  it('returns an empty array when both input arrays are empty', () => {
    const result = mergeRadiologyLists([], []);
    expect(result).to.deep.equal([]);
  });

  it('returns the PHR list when CVIX list is empty', () => {
    const phrList = [{ id: 1, sortDate: '2020-01-01T12:00:00Z' }];
    const result = mergeRadiologyLists(phrList, []);
    expect(result).to.deep.equal(phrList);
  });

  it('returns the CVIX list when PHR list is empty', () => {
    const cvixList = [{ id: 2, sortDate: '2020-01-02T12:00:00Z' }];
    const result = mergeRadiologyLists([], cvixList);
    expect(result).to.deep.equal(cvixList);
  });

  it('concatenates lists when there are no matching dates', () => {
    const phrList = [{ id: 1, sortDate: '2020-01-01T12:00:00Z' }];
    const cvixList = [{ id: 2, sortDate: '2020-01-02T12:00:00Z' }];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result).to.deep.equal([...phrList, ...cvixList]);
  });

  it('handles multiple matches correctly', () => {
    const phrList = [
      { id: 1, sortDate: '2020-01-01T10:00:00Z', data: 'phr1' },
      { id: 2, sortDate: '2020-01-02T11:00:00Z', data: 'phr2' },
    ];
    const cvixList = [
      { id: 3, sortDate: '2020-01-01T10:00:00Z', studyId: 'c1', imageCount: 1 },
      { id: 4, sortDate: '2020-01-02T11:00:00Z', studyId: 'c2', imageCount: 2 },
      { id: 5, sortDate: '2020-01-03T12:00:00Z', studyId: 'c3', imageCount: 3 },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result).to.deep.equal([
      {
        id: 1,
        sortDate: '2020-01-01T10:00:00Z',
        data: 'phr1',
        studyId: 'c1',
        imageCount: 1,
      },
      {
        id: 2,
        sortDate: '2020-01-02T11:00:00Z',
        data: 'phr2',
        studyId: 'c2',
        imageCount: 2,
      },
      {
        id: 5,
        sortDate: '2020-01-03T12:00:00Z',
        studyId: 'c3',
        imageCount: 3,
      },
    ]);
  });

  it('merges records by hash when dates differ (ticket #132099)', () => {
    // This test verifies the fix for duplicate radiology records appearing
    // when PHR and CVIX have the same study but with different timestamps
    const phrList = [
      {
        id: 'r12345-abc123ef',
        sortDate: '2020-01-01T10:00:00Z',
        data: 'phr1',
      },
    ];
    const cvixList = [
      {
        id: 'r67890-abc123ef', // Same hash, different raw ID
        sortDate: '2020-01-01T10:05:00Z', // 5 minutes later - would not match by date
        studyId: 'c1',
        imageCount: 1,
      },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result.length).to.equal(1);
    expect(result[0]).to.deep.equal({
      id: 'r12345-abc123ef',
      sortDate: '2020-01-01T10:00:00Z',
      data: 'phr1',
      studyId: 'c1',
      imageCount: 1,
    });
  });

  it('does not merge records when hashes and dates both differ', () => {
    const phrList = [
      {
        id: 'r12345-abc123ef',
        sortDate: '2020-01-01T10:00:00Z',
        data: 'phr1',
      },
    ];
    const cvixList = [
      {
        id: 'r67890-different1',
        sortDate: '2020-01-01T10:05:00Z', // Different date and different hash
        studyId: 'c1',
        imageCount: 1,
      },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result.length).to.equal(2);
  });

  it('merges records by normalized procedure name + same day (ticket #132099)', () => {
    // This test verifies the fix for duplicate radiology records where:
    // - PHR has no newline in procedure name, CVIX has newline
    // - Radiologist differs (included in hash)
    // - Same calendar day but different times
    const phrList = [
      {
        id: 'r12345-abc123ef',
        name: 'KNEE 4 OR MORE VIEWS (LEFT)', // No newline
        sortDate: '2024-04-04T17:08:00Z',
        data: 'phr1',
      },
    ];
    const cvixList = [
      {
        id: 'r67890-different1', // Different hash due to radiologist mismatch
        name: 'KNEE\n 4 OR MORE VIEWS (LEFT)', // Has newline
        sortDate: '2024-04-04T17:03:00Z', // Same day, different time (5 min diff)
        studyId: 'c1',
        imageCount: 4,
      },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result.length).to.equal(1);
    expect(result[0]).to.deep.equal({
      id: 'r12345-abc123ef',
      name: 'KNEE 4 OR MORE VIEWS (LEFT)',
      sortDate: '2024-04-04T17:08:00Z',
      data: 'phr1',
      studyId: 'c1',
      imageCount: 4,
    });
  });

  it('does not merge records with different procedure names even on same day', () => {
    const phrList = [
      {
        id: 'r12345-abc123ef',
        name: 'KNEE 4 OR MORE VIEWS (LEFT)',
        sortDate: '2024-04-04T17:08:00Z',
        data: 'phr1',
      },
    ];
    const cvixList = [
      {
        id: 'r67890-different1',
        name: 'CT THORAX W/CONT', // Different procedure
        sortDate: '2024-04-04T17:03:00Z', // Same day
        studyId: 'c1',
        imageCount: 4,
      },
    ];
    const result = mergeRadiologyLists(phrList, cvixList);
    expect(result.length).to.equal(2);
  });
});
