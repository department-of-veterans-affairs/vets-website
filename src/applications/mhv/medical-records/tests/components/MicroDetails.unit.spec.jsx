import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import MicroDetails from '../../components/LabsAndTests/MicroDetails';

describe('Microbiology details component', () => {
  const mockMicro = {
    name: 'Microbiology',
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 124,
    date: '2018-05-04T17:42:46.000Z',
    sampleFrom: 'Blood',
    sampleTested: 'Blood',
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation: 'school parking lot',
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    results:
      'Accession [UID]: MI 16 3065 [1216003065] Received: Jul 08, 2016@11:29\nCollection sample: VENOUS BLOOD Collection date: Jul 08, 2016 11:29\nSite/Specimen: BLOOD VENOUS\nProvider: MCNALLY,PEGGY A\n\n\n* BACTERIOLOGY FINAL REPORT => Jul 09, 2016 09:56 TECH CODE: 205931\nCULTURE RESULTS: ESCHERICHIA COLI - Quantity: 2+\nANTIBIOTIC SUSCEPTIBILITY TEST RESULTS:\nESCHERICHIA COLI\n:\nAMPICILLIN.................... S\nAMPICILLIN/SULBACTAM.......... S\nCEFAZOLIN..................... S\nTOBRMCN....................... S\nGENTMCN....................... S\nCEFTRIAXONE................... S\nCIPROFLOXACIN................. S\nAMOXICILLIN/CLAVULANATE....... S\nTRIMETH/SULF.................. S\nLEVOFLOXACIN.................. S\n\n=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--\nPerforming Laboratory:\nBacteriology Report Performed By:\nROSEBURG VA MEDICAL CENTER [CLIA# 38D0988132]\nMHVZZVISNTWENTY, TEST PATIENTR CONFIDENTIAL Page 40 of 98\n913 NW GARDEN VALLEY BLVD. ROSEBURG, OR 97471-6523\n-----------------------------------------------------------------------------\nResult Key:\nSUSC = Susceptibility Result S = Susceptible\nINTP = Interpretation I = Intermediate\nMIC = Minimum Inhibitory Concentration R = Resistant',
  };

  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockMicro,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <MicroDetails record={mockMicro} fullState={state} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/labs-and-tests/124',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the test name', () => {
    const screen = setup();
    const header = screen.getAllByText(mockMicro.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const formattedDate = screen.getAllByText('May 4, 2018', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const screen = setup();

    const results = screen.getByText(mockMicro.results.split('\n')[0], {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
  });
});
