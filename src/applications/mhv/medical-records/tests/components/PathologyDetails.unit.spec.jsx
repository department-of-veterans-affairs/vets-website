import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import PathologyDetails from '../../components/LabsAndTests/PathologyDetails';

describe('Pathology details component', () => {
  const mockPatho = {
    name: 'Surgical pathology',
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 125,
    date: '2016-04-28T17:42:46.000Z',
    sampleTested: 'LEFT FINGER',
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    results:
      'LOCAL TITLE: LR SURGICAL PATHOLOGY REPORT\nDATE OF NOTE: MAR 02, 2020@10:03:38 ENTRY DATE: MAR 02, 2020@10:03:38\nAUTHOR: DANILOVA,OLGA V EXP COSIGNER:\nURGENCY: STATUS: COMPLETED\n$APHDR\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nMEDICAL RECORD | SURGICAL PATHOLOGY\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nPATHOLOGY REPORT Accession No. SP 20 999999\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n$TEXT\nSubmitted by: Date obtained: Jan 21, 2020\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nSpecimen (Received Jan 21, 2020 16:21):\nTEST SPECIMEN\n*+* SUPPLEMENTARY REPORT HAS BEEN ADDED *+*\n*+* REFER TO BOTTOM OF REPORT *+*\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nBRIEF CLINICAL HISTORY:\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nPREOPERATIVE DIAGNOSIS:\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nOPERATIVE FINDINGS:\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nPOSTOPERATIVE DIAGNOSIS:\nSurgeon/physician: LISA M WINTERBOTTOM MD\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nPATHOLOGY REPORT Accession No. SP 20 999999\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nMICROSCOPIC EXAM:\nDIAGNOSIS AFTER MICROSCOPIC EXAM:\n\nTEST SPECIMEN, CHEST:\n- TEST SPECIMEN.\n\nOLGA V. DANILOVA, M.D.\nSTAF PATHOLOGIST\nPATHOLOGY AND LAB MED\n\nSUPPLEMENTARY REPORT(S):\nSupplementary Report Date: MAR 02, 2020\n*+* SUPPLEMENTARY REPORT HAS BEEN ADDED/MODIFIED *+*\n(Added/Last released: Mar 02, 2020 10:03 Signed by DANILOVA,OLGA V)\nADDENDUM: This addendum is issued to report test addendum report.\n\nAddendum rendered by:\n\nOLGA V. DANILOVA, M.D.\nSTAFF PATHOLOGIST\nPATHOLOGY AND LAB MED\n\n/es/ Olga V DANILOVA, MD\nStaff Pathologist\nSigned Mar 02, 2020@10:03\nPerforming Laboratory:\nSurgical Pathology Report Performed By:\nPORTLAND VA MEDICAL CENTER [CLIA# 38D0988131]\n3710 SW US VETERANS HOSPTL RD PORTLAND, OR 97239-2964\n$FTR\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n(End of report)\nOlga V DANILOVA ovd| Date Jan 21, 2020\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\nMHVZZVISNTWENTY,TEST PATIENTR STANDARD FORM 515\nID:666-66-2000 SEX:M DOB:01/01/2001 AGE: 19 LOC:AAALAB\nPCP:\n/es/ Olga V DANILOVA, MD\nStaff Pathologist\nSigned: 03/02/2020 10:03',
  };

  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockPatho,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <PathologyDetails record={mockPatho} fullState={state} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/labs-and-tests/125',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the test name', () => {
    const screen = setup();
    const header = screen.getAllByText(mockPatho.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const formattedDate = screen.getAllByText('April 28, 2016', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const screen = setup();

    const results = screen.getByText(mockPatho.results.split('\n')[0], {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
  });
});
