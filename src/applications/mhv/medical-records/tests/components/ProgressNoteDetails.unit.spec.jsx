import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import ProgressNoteDetails from '../../components/CareSummaries/ProgressNoteDetails';

describe('Progress Note details component', () => {
  const mockSummary = {
    id: 121,
    name: 'Primary care progress note',
    type: '11505-5',
    physician: 'Beth M. Smith',
    dateSigned: 'April 1, 2022',
    dateUpdated: 'April 3, 2022',
    location: 'Cambridge Based Outpatient Clinic',
    note:
      " LOCAL TITLE: PRIMARY CARE PROGRESS NOTE\nSTANDARD TITLE: PRIMARY CARE NOTE\nDATE OF NOTE: JUL 19, 2022@21:36 ENTRY DATE: JUL 19, 2022@21:36:45\n AUTHOR: MONK,ADRIAN EXP COSIGNER:\nURGENCY: STATUS: COMPLETED\nPRIMARY CARE PROGRESS NOTE\n Face-to-Face\n MHVZZVISNTWENTY,TEST PATIENTR is a 21 year old veteran who presents for a\n face-to-face follow-up visit.\n CHIEF COMPLAINT/HISTORY OF PRESENT ILLNESS: Testing to see if after visit\n summary viewable in JLV\n EXAM\n NO VITALS FOUND SpO2 ---\n General:\n Chest:\n Cardiovascular:\n Abdomen:\n Extremities:\n Other:\n ASSESSMENT/PLAN\n Written After Visit Summary instructions reviewed with patient. Patient\n provided copy of updated medication list.\n RETURN TO CLINIC: Per RTC order, or sooner PRN\n Total time spent in clinical care related to this visit: 5 minutes\n MEDICATION RECONCILIATION:\n Medication Reconciliation was not performed at this visit as patient\n and/or caregiver is not able to confirm medications he/she is taking. The\n importance of managing medication information was explained to the\n patient.\n PAST MEDICAL HISTORY\n Enter Problems:\n No active problems in computerized problem list as of 7/19/22@21:36\n SERVICE CONNECTED CONDITIONS\n LUNG CONDITION 60% S/C\n MEDICATIONS\n Local:\n Active Outpatient Medications (excluding Supplies):\n No Medications Found\n Remote: No Active Remote Medications for this patient\n ALLERGIES\n Local: Allergy Assessment Not Done\n Remote:\n FACILITY ALLERGY/ADR\n -------- -----------\n 363^ANCHORAGE VA MEDICAL CENTER^463 TETANUS TOXOID\n 648^PORTLAND VA MEDICAL CENTER^648 ADHESIVE TAPE\n 648^PORTLAND VA MEDICAL CENTER^648 ALUMINUM HYDROXIDE/MAGNESIUM HYDROXIDE\nMHVZZVISNTWENTY, TEST PATIENTR CONFIDENTIAL Page 46 of 2094\n 648^PORTLAND VA MEDICAL CENTER^648 EGGS\n 648^PORTLAND VA MEDICAL CENTER^648 LISINOPRIL\n 648^PORTLAND VA MEDICAL CENTER^648 PENICILLIN\n 648^PORTLAND VA MEDICAL CENTER^648 PRAZOSIN\n 648^PORTLAND VA MEDICAL CENTER^648 SULFA DRUGS\n 648^PORTLAND VA MEDICAL CENTER^648 TETRACYCLINE\n 668^MANN-GRANDSTAFF VAMC^668 CLINDAMYCIN\n 687^JONATHAN M. WAINWRIGHT VAMC^687 PENICILLIN\n LABS:\n No data available HEMOGLOBIN A1c,INTEGRA - NONE FOUND\n No data available for: CHOLESTEROL\n TRIGLYCERIDES\n HDL CHOLESTEROL\n LDL, CALCULATED\n LDL, DIRECT No CBC Panel Found\n /es/ Adrian Monk, DNP, ARNP, FNP-BC\nNurse Practitioner - Women's Health Clinic\nSigned: 07/19/2022 21:42",
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
      <ProgressNoteDetails record={mockSummary} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/health-history/care-summaries-and-notes/121',
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

    const formattedDate = screen.getAllByText('April 1, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });
});
