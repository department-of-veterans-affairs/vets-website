import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import AdmissionAndDischargeDetails from '../../components/CareSummaries/AdmissionAndDischargeDetails';

describe('Admission and discharge summary details component', () => {
  const mockSummary = {
    name: 'Admission and discharge summary',
    admittingPhysician: 'Gregory House, M.D.',
    dischargePhysician: 'Gregory House, M.D.',
    id: 122,
    startDate: '2022-04-13T17:42:46.000Z',
    endDate: '2022-04-15T17:42:46.000Z',
    facility: 'Dayton VA Medical Center',
    reactions: ['Just this one'],
    summary:
      ' LOCAL TITLE: Discharge Summary\nSTANDARD TITLE: DISCHARGE SUMMARY\n DICT DATE: APR 7, 2023@12:58 ENTRY DATE: APR 6, 2023@12:58:57\n DICTATED BY: HOUSE, GREGORY ATTENDING: HOUSE, GREGORY\n URGENCY: routine STATUS: COMPLETED\nDATE OF ADMISSION:\nDATE OF DISCHARGE:\nATTENDING PHYSICIAN:\nPRIMARY CARE PROVIDER/FACILITY:\nPRIMARY DIAGNOSIS FOR THIS ADMISSION:\nOTHER DIAGNOSES TREATED DURING THIS ADMISSION THAT WERE PRESENT AT THE\nTIME OF ADMISSION:\nOTHER DIAGNOSES TREATED DURING THIS ADMISSION THAT DEVELOPED AFTER\nADMISSION, IF ANY:\nPROCEDURES PERFORMED DURING THIS ADMISSION:\nPERTINENT IMAGING PERFORMED DURING THIS ADMISSION:\n (Include summary of main imaging results)\nCONSULTS OBTAINED DURING THIS ADMISSION:\n_______________________________________________________________\nBRIEF HPI (SEE ADMIT NOTE FOR COMPLETE DETAILS):\n (Presenting symptoms, pertinent exam, lab and imaging findings)\n_______________________________________________________________\nHOSPITAL COURSE, BY PROBLEM:\n (Pertinent treatment provided, complications, suggestions for\n future management, follow up care needed)\n #\n #\n #\n #\n #\nEXAM ON DAY OF DISCHARGE:\n Discharge Vitals:\n Focused Exam:\n_______________________________________________________________\nDISCHARGE MEDICATION LIST\n(Must copy and paste from Pharmacy Discharge Instructions so both lists\nmatch exactly)\nActive Medications:\nActive and Recently Expired Outpatient Medications (excluding Supplies):\n Active Outpatient Medications Status\n=========================================================================\n1) AMLODIPINE BESYLATE 5MG TAB TAKE ONE TABLET BY MOUTH ACTIVE (S)\n EVERY DAY FOR BLOOD PRESSURE\n2) ASPIRIN 325MG TAB TAKE ONE TABLET BY MOUTH EVERY DAY ACTIVE (S)\n AS DIRECTED\n3) ATORVASTATIN CALCIUM 80MG TAB TAKE ONE TABLET BY ACTIVE (S)\n MOUTH EVERY EVENING TO LOWER CHOLESTEROL *AVOID\n GRAPEFRUIT PRODUCTS WITH THIS MEDICINE\n4) METFORMIN HCL 500MG 24HR SA TAB TAKE TWO TABLETS BY ACTIVE (S)\n MOUTH WITH YOUR EVENING MEAL\n Pending Outpatient Medications Status\n=========================================================================\n1) LISINOPRIL 5MG TAB TAKE ONE TABLET BY MOUTH EVERY DAY PENDING\n FOR BLOOD PRESSURE\n2) METFORMIN HCL 500MG 24HR SA TAB TAKE ONE TABLET BY PENDING\n MOUTH WITH YOUR EVENING MEAL\n Inactive Outpatient Medications Status\n=========================================================================\n1) AMOXICILLIN 250MG CAP TAKE ONE CAPSULE BY MOUTH THREE EXPIRED\nMHVZZVISNTWENTY, TEST PATIENTR CONFIDENTIAL Page 5 of 14\n TIMES A DAY\n2) ATORVASTATIN 10MG TAB (GREENSTONE BRAND) TAKE ONE EXPIRED\n TABLET EVERY DAY HAS\n Active Non-VA Medications Status\n=========================================================================\n1) Non-VA MULTIVITAMIN CAP/TAB 1 CAP/TAB MOUTH EVERY DAY ACTIVE\n9 Total Medications\n=====================================================================\nPending prescriptions written within last 7 days\n=====================================================================\n*** PENDING outpatient meds ordered in the last 7 days: ***\nLisinopril Tab 5Mg\n Take One Tablet By Mouth Every Day For Blood Pressure\n Quantity: 90 Refills: 3\n Order Status: Pending Provider: LISA M WINTERBOTTOM, M.D.\nMetformin Tab,sa 500Mg\n Take One Tablet By Mouth With Your Evening Meal\n Quantity: 90 Refills: 3\n Order Status: Pending Provider: LISA M WINTERBOTTOM, M.D.\n=====================================================================\nRemote VA Pharmacy medication/allergy information\n=====================================================================\nHDRM - Remote Active Meds\nActive Medications from Remote Data\nCLOPIDOGREL BISULFATE 75MG TAB\nSig: TAKE ONE TABLET EVERY DAY\nQuantity: 30 Days Supply: 30\n11 refills remaining until 01/31/21\nLast filled 01/31/20 at MANN-GRANDSTAFF VAMC (Active)\nRART - Remote ADR\nFACILITY ALLERGY/ADR\n-------- -----------\n/es/ LISA M WINTERBOTTOM, M.D.\nStaff Physician\nSigned: 02/26/2020 13:00',
  };

  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: mockSummary,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <AdmissionAndDischargeDetails results={mockSummary} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/health-history/care-summaries-and-notes/122',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the summary name', () => {
    const screen = setup();
    const header = screen.getAllByText(mockSummary.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const formattedDate = screen.getByText('April 13, 2022 to April 15, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });
});
