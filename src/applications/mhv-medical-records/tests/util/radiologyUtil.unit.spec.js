import { expect } from 'chai';
import {
  areDatesEqualToMinute,
  findMatchingCvixReport,
  findMatchingPhrAndCvixStudies,
  parseRadiologyReport,
  radiologyReportsMatch,
} from '../../util/radiologyUtil';

describe('parseRadiologyReport', () => {
  it('parses a radiology report', () => {
    const report =
      "1^KNEE 4 OR MORE VIEWS (LEFT)^PATIENTLAST,JOHN\r\nGroup ID# 2487450\r\n_______________________________________________________________________________\r\nPATIENTLAST,JOHN      521-45-2884    DOB-DEC 25, 1934 M   \r\nExm Date: APR 04, 2024@17:03\r\nReq Phys: PHYSLASTNAME,BOB               Pat Loc: NHM/CARDIOLOGY/CASEY (Req'g Lo\r\n                                         Img Loc: WOR/X-RAY\r\n                                         Service: Unknown\r\n\r\n                                     WORCESTER CBOC\r\n                                     WORCESTER, MA 01605\r\n                                            \r\n \r\n\r\n(Case 93 CALLED F)   KNEE 4 OR MORE VIEWS (LEFT)      (RAD  Detailed) CPT:73564\r\n     Reason for Study: Test data number2 Todd\r\n\r\n    Clinical History:\r\n\r\n    Report Status: Verified                   Date Reported: APR 05, 2024\r\n                                              Date Verified: APR 05, 2024\r\n    Verifier E-Sig:\r\n\r\n    Report:\r\n      For providers and interpreters, identification of normal bony\r\n      anatomical landmarks is important. On the AP view the adductor\r\n      tubercle, the site of the attachment of the adductor magnus\r\n      tendon, can be seen as a bony protrusion just above the medi al\r\n      border of the medial femoral condyle and a groove in the lateral\r\n      profile of the lateral femoral condyle is formed by the popliteus\r\n      sulcus [4].  \r\n\r\n    Impression:\r\n      1. Degenerative arthritis of left knee which has shown\r\n      progression since 1980.  2. Advanced degenerative changes of\r\n      right knee with evidence of previous patellectomy.  Not much\r\n      change is seen since the last exam of 6-21-89.  \r\n\r\n    Primary Diagnostic Code: MINOR ABNORMALITY\r\n\r\nPrimary Interpreting Staff:\r\n  JANE J LASTNAME, RADIOLOGIST\r\n          Verified by transcriptionist for JANE J LASTNAME\r\n/DP\r\n\r\n\r\n** END REPORT Nov 06, 2024 11:04:23 am **";
    const parsedReport = parseRadiologyReport(report);
    expect(parsedReport['Exm Date']).to.eq('APR 04, 2024@17:03');
    expect(parsedReport['Req Phys']).to.eq('PHYSLASTNAME,BOB');
    expect(parsedReport['Reason for Study']).to.eq('Test data number2 Todd');
    expect(parsedReport['Report Status']).to.eq('Verified');
    expect(parsedReport['Clinical History']).to.eq('');
    expect(parsedReport.Report.length).to.eq(391);
    expect(parsedReport.Impression.length).to.eq(266);
  });
});

describe('areDatesEqualToMinute', () => {
  it('returns true for identical dates in the same format', () => {
    const date1 = '2023-10-01T12:30:00Z';
    const date2 = '2023-10-01T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.true;
  });

  it('returns true for identical dates in different formats', () => {
    const date1 = '1712264604902'; // Timestamp in milliseconds
    const date2 = '2024-04-04T21:03:24Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.true;
  });

  it('returns true when seconds differ but minutes are the same', () => {
    const date1 = '2023-10-01T12:30:00Z';
    const date2 = '2023-10-01T12:30:59Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.true;
  });

  it('returns false when minutes differ', () => {
    const date1 = '2023-10-01T12:30:00Z';
    const date2 = '2023-10-01T12:31:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false when hours differ', () => {
    const date1 = '2023-10-01T11:30:00Z';
    const date2 = '2023-10-01T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false when days differ', () => {
    const date1 = '2023-10-01T12:30:00Z';
    const date2 = '2023-10-02T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false when months differ', () => {
    const date1 = '2023-09-01T12:30:00Z';
    const date2 = '2023-10-01T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false when years differ', () => {
    const date1 = '2022-10-01T12:30:00Z';
    const date2 = '2023-10-01T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false for invalid first date', () => {
    const date1 = 'invalid-date';
    const date2 = '2023-10-01T12:30:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false for invalid second date', () => {
    const date1 = '2023-10-01T12:30:00Z';
    const date2 = 'invalid-date';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns false for both dates invalid', () => {
    const date1 = 'invalid-date';
    const date2 = 'also-invalid';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });

  it('returns true for dates with different time zones but same UTC time', () => {
    const date1 = '2023-10-01T07:30:00-05:00'; // UTC-5
    const date2 = '2023-10-01T12:30:00Z'; // UTC
    expect(areDatesEqualToMinute(date1, date2)).to.be.true;
  });

  it('returns false when comparing date to timestamp in seconds (not milliseconds)', () => {
    const date1 = '1609459200'; // Should be invalid because it's seconds since epoch
    const date2 = '2021-01-01T00:00:00Z';
    expect(areDatesEqualToMinute(date1, date2)).to.be.false;
  });
});

describe('radiologyReportsMatch', () => {
  it('should return true when eventDate and performedDatePrecise match to the minute', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponse = { performedDatePrecise: '2023-10-01T12:30:59Z' };
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.true;
  });

  it('should return false when eventDate and performedDatePrecise do not match', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponse = { performedDatePrecise: '2001-10-01T12:30:59Z' };
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.false;
  });

  it('should return false when eventDate is missing', () => {
    const phrResponse = {};
    const cvixResponse = { performedDatePrecise: '2001-10-01T12:30:59Z' };
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.false;
  });

  it('should return false when performedDatePrecise is missing', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponse = {};
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.false;
  });

  it('should return false when phrResponse is null', () => {
    const phrResponse = null;
    const cvixResponse = { performedDatePrecise: '2001-10-01T12:30:59Z' };
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.false;
  });

  it('should return false when cvixResponse is null', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponse = null;
    expect(radiologyReportsMatch(phrResponse, cvixResponse)).to.be.false;
  });
});

describe('findMatchingCvixReport', () => {
  it('should return the matching CVIX report when a match is found', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };

    const cvixResponseList = [
      { performedDatePrecise: '2023-10-01T12:29:00Z', id: 1 },
      { performedDatePrecise: '2023-10-01T12:30:59Z', id: 2 }, // Matching report
      { performedDatePrecise: '2023-10-01T12:31:00Z', id: 3 },
    ];

    const result = findMatchingCvixReport(phrResponse, cvixResponseList);

    expect(result?.id).to.eq(2);
  });

  it('should return null when no matching CVIX report is found', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };

    const cvixResponseList = [
      { performedDatePrecise: '2023-10-01T12:29:00Z', id: 1 },
      { performedDatePrecise: '2023-10-01T12:31:00Z', id: 2 },
    ];

    const result = findMatchingCvixReport(phrResponse, cvixResponseList);

    expect(result).to.be.null;
  });

  it('should return null when cvixResponseList is empty', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponseList = [];

    const result = findMatchingCvixReport(phrResponse, cvixResponseList);

    expect(result).to.be.null;
  });

  it('should return null when cvixResponseList is null', () => {
    const phrResponse = { eventDate: '2023-10-01T12:30:00Z' };
    const cvixResponseList = null;

    const result = findMatchingCvixReport(phrResponse, cvixResponseList);

    expect(result).to.be.null;
  });

  it('should return null when phrResponse is null', () => {
    const phrResponse = null;
    const cvixResponseList = [
      { performedDatePrecise: '2023-10-01T12:30:00Z', id: 1 },
    ];

    const result = findMatchingCvixReport(phrResponse, cvixResponseList);

    expect(result).to.be.null;
  });
});

describe('findMatchingPhrAndCvixStudies', () => {
  beforeEach(() => {
    // Mock the global crypto.subtle.digest function to always return all zeroes.
    global.crypto = {
      subtle: {
        digest: () => {
          // Return a static hash value (e.g., 16-byte ArrayBuffer)
          const staticHash = new Uint8Array(16).fill(0).buffer;
          return Promise.resolve(staticHash);
        },
      },
    };
  });

  it('should return the PHR response by ID', async () => {
    const phrResponse = [{ id: '12345', eventDate: '2022-01-01' }];
    const cvixResponse = [{ id: 'YYYYY', performedDatePrecise: 1700000000000 }];

    const record = await findMatchingPhrAndCvixStudies(
      'r12345-aaaaaaaa',
      phrResponse,
      cvixResponse,
    );
    expect(record.phrDetails.id).to.equal('12345');
    expect(record.cvixDetails).to.be.null;
  });

  it('should return the PHR response by hash', async () => {
    const phrResponse = [{ id: '12345', eventDate: '2022-01-01' }];
    const cvixResponse = [{ id: 'YYYYY', performedDatePrecise: 1700000000000 }];

    const record = await findMatchingPhrAndCvixStudies(
      'rXXXXX-e4fae142',
      phrResponse,
      cvixResponse,
    );
    expect(record.phrDetails.id).to.equal('12345');
    expect(record.cvixDetails).to.be.null;
  });

  it('should return nothing if neither ID nor hash matches', async () => {
    const phrResponse = [{ id: '12345', eventDate: '2022-01-01' }];

    const record = await findMatchingPhrAndCvixStudies(
      'rXXXXX-aaaaaaaa',
      phrResponse,
    );
    expect(record.phrDetails).to.be.null;
    expect(record.cvixDetails).to.be.null;
  });

  it('should return the CVIX response by ID', async () => {
    const cvixResponse = [{ id: '12345', performedDatePrecise: 1712264604902 }];

    const record = await findMatchingPhrAndCvixStudies(
      'r12345-aaaaaaaa',
      null,
      cvixResponse,
    );
    expect(record.phrDetails).to.be.null;
    expect(record.cvixDetails.id).to.equal('12345');
  });

  it('should return the CVIX response by hash', async () => {
    const cvixResponse = [{ id: '12345', performedDatePrecise: 1712264604902 }];

    const record = await findMatchingPhrAndCvixStudies(
      'rXXXXX-5c4d0c86',
      null,
      cvixResponse,
    );
    expect(record.phrDetails).to.be.null;
    expect(record.cvixDetails.id).to.equal('12345');
  });

  it('should return the PHR details with matching CVIX details', async () => {
    const date = new Date();
    const isoDate = date.toISOString();
    const datetime = date.getTime();
    const phrResponse = [
      { id: '12345', eventDate: isoDate },
      { id: 'XXXXX', eventDate: isoDate },
    ];
    const cvixResponse = [
      { id: '67890', performedDatePrecise: datetime },
      { id: 'YYYYY', performedDatePrecise: 1700000000000 },
    ];

    const record = await findMatchingPhrAndCvixStudies(
      'r12345-aaaaaaaa',
      phrResponse,
      cvixResponse,
    );
    expect(record.phrDetails.id).to.equal('12345');
    expect(record.cvixDetails.id).to.equal('67890');
  });

  it('should return null values if both lists are null', async () => {
    const record = await findMatchingPhrAndCvixStudies(
      'r12345-aaaaaaaa',
      null,
      null,
    );
    expect(record.phrDetails).to.be.null;
    expect(record.cvixDetails).to.be.null;
  });

  it('should return null values if both lists are empty', async () => {
    const record = await findMatchingPhrAndCvixStudies(
      'r12345-aaaaaaaa',
      [],
      [],
    );
    expect(record.phrDetails).to.be.null;
    expect(record.cvixDetails).to.be.null;
  });
});
