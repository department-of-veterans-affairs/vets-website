import { expect } from 'chai';
import { parseRadiologyReport } from '../../util/radiologyUtil';

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
