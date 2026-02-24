import { expect } from 'chai';
import { parseISO } from 'date-fns';
import {
  buildRadiologyResults,
  convertMhvRadiologyRecord,
  convertCvixRadiologyRecord,
  convertScdfImagingStudy,
  mergeImagingStudiesIntoLabs,
  mergeRadiologyLists,
} from '../../util/imagesUtil';
import { EMPTY_FIELD } from '../../util/constants';

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

describe('convertScdfImagingStudy', () => {
  it('converts a full JSONAPI record', () => {
    const record = {
      id: 'study-123',
      attributes: {
        description: 'CHEST 2 VIEWS PA&LAT',
        date: '2025-01-10T09:17:00Z',
        notes: ['Note A', 'Note B'],
        identifier: 'urn:vastudy:200CRNR-CM_4',
        series: [{ uid: 's1' }],
        status: 'available',
      },
    };
    const result = convertScdfImagingStudy(record);
    expect(result.id).to.equal('study-123');
    expect(result.name).to.equal('CHEST 2 VIEWS PA&LAT');
    expect(result.date).to.be.a('string');
    expect(result.date).to.not.equal(EMPTY_FIELD);
    expect(result.rawDate).to.equal('2025-01-10T09:17:00Z');
    expect(result.results).to.equal('Note A\nNote B');
    expect(result.studyId).to.equal('urn:vastudy:200CRNR-CM_4');
    expect(result.series).to.deep.equal([{ uid: 's1' }]);
    expect(result.status).to.equal('available');
  });

  it('uses EMPTY_FIELD for missing fields', () => {
    const record = { id: 'minimal' };
    const result = convertScdfImagingStudy(record);
    expect(result.id).to.equal('minimal');
    expect(result.name).to.equal(EMPTY_FIELD);
    expect(result.date).to.equal(EMPTY_FIELD);
    expect(result.rawDate).to.be.null;
    expect(result.results).to.equal(EMPTY_FIELD);
    expect(result.studyId).to.equal('minimal');
    expect(result.series).to.deep.equal([]);
    expect(result.status).to.be.null;
  });

  it('falls back to record-level properties when attributes is absent', () => {
    const record = {
      id: 'flat-record',
      description: 'FLAT DESC',
      date: '2025-06-01T12:00:00Z',
      notes: ['Flat note'],
      identifier: 'flat-id',
      series: [{ uid: 'flat-s1' }],
      status: 'complete',
    };
    const result = convertScdfImagingStudy(record);
    expect(result.name).to.equal('FLAT DESC');
    expect(result.studyId).to.equal('flat-id');
    expect(result.status).to.equal('complete');
  });

  it('joins notes with newline', () => {
    const record = {
      id: 'notes-test',
      attributes: { notes: ['Line 1', 'Line 2', 'Line 3'] },
    };
    const result = convertScdfImagingStudy(record);
    expect(result.results).to.equal('Line 1\nLine 2\nLine 3');
  });

  it('returns EMPTY_FIELD for empty notes array', () => {
    const record = { id: 'empty-notes', attributes: { notes: [] } };
    const result = convertScdfImagingStudy(record);
    expect(result.results).to.equal(EMPTY_FIELD);
  });
});

describe('mergeImagingStudiesIntoLabs', () => {
  it('returns labsList unchanged when imagingStudies is empty', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:15:00Z' }];
    const result = mergeImagingStudiesIntoLabs(labs, []);
    expect(result).to.equal(labs);
  });

  it('returns empty array when both inputs are empty', () => {
    const result = mergeImagingStudiesIntoLabs([], []);
    expect(result).to.deep.equal([]);
  });

  it('matches records within tolerence window and copies imaging fields', () => {
    const labs = [
      { id: 'lab-1', sortDate: '2025-01-10T09:15:00Z', name: 'CHEST XRAY' },
    ];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:17:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result).to.have.lengthOf(1);
    expect(result[0].imagingStudyId).to.equal('study-1');
    expect(result[0].imagingStudyStatus).to.equal('available');
    expect(result[0].name).to.equal('CHEST XRAY');
  });

  it('does not match records outside the tolerance window', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' }];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:11:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0]).to.not.have.property('imagingStudyId');
  });

  it('matches at exactly 10 minutes apart', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' }];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:10:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0].imagingStudyId).to.equal('study-1');
  });

  it('does not match at 10 minutes and 1 second apart', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' }];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:10:01Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0]).to.not.have.property('imagingStudyId');
  });

  it('uses each imaging study at most once (1:1 matching)', () => {
    const labs = [
      { id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' },
      { id: 'lab-2', sortDate: '2025-01-10T09:02:00Z' },
    ];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:01:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    const matched = result.filter(r => r.imagingStudyId);
    expect(matched).to.have.lengthOf(1);
    expect(matched[0].id).to.equal('lab-1');
  });

  it('skips labs without sortDate', () => {
    const labs = [
      { id: 'no-date' },
      { id: 'with-date', sortDate: '2025-01-10T09:00:00Z' },
    ];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:01:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0]).to.not.have.property('imagingStudyId');
    expect(result[1].imagingStudyId).to.equal('study-1');
  });

  it('skips imaging studies without rawDate', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' }];
    const studies = [{ id: 'study-1', status: 'available' }];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0]).to.not.have.property('imagingStudyId');
  });

  it('skips labs with invalid sortDate', () => {
    const labs = [{ id: 'lab-1', sortDate: 'not-a-date' }];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:00:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0]).to.not.have.property('imagingStudyId');
  });

  it('handles multiple labs matching multiple studies', () => {
    const labs = [
      { id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' },
      { id: 'lab-2', sortDate: '2025-01-10T14:00:00Z' },
      { id: 'lab-3', sortDate: '2025-01-11T10:00:00Z' },
    ];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:02:00Z', status: 'available' },
      { id: 'study-2', rawDate: '2025-01-11T10:05:00Z', status: 'complete' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(result[0].imagingStudyId).to.equal('study-1');
    expect(result[1]).to.not.have.property('imagingStudyId');
    expect(result[2].imagingStudyId).to.equal('study-2');
    expect(result[2].imagingStudyStatus).to.equal('complete');
  });

  it('does not mutate the original labs array', () => {
    const labs = [{ id: 'lab-1', sortDate: '2025-01-10T09:00:00Z' }];
    const studies = [
      { id: 'study-1', rawDate: '2025-01-10T09:01:00Z', status: 'available' },
    ];
    const result = mergeImagingStudiesIntoLabs(labs, studies);
    expect(labs[0]).to.not.have.property('imagingStudyId');
    expect(result[0].imagingStudyId).to.equal('study-1');
  });
});
