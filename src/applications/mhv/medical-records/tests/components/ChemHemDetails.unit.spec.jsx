import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import ChemHemDetails from '../../components/LabsAndTests/ChemHemDetails';

describe('Chem Hem details component', () => {
  const mockChemHem = {
    name: 'Complete blood count',
    category: 'Chemistry and hematology',
    sampleTested: 'Blood',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    id: 121,
    date: '2022-06-14T17:42:46.000Z',
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    comments: ["Jesse Roberts' blood panel is standard"],
    results: [
      {
        name: 'WBC',
        result: '5.0 K/ccm',
        standardRange: '4.5 - 10.5 K/ccm',
        status: 'Final',
        labLocation:
          '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
        interpretation: 'ref. range prior to 1/16/03 was 26-71 mg/dL.',
      },
    ],
  };

  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: mockChemHem,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <ChemHemDetails record={mockChemHem} fullState={state} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/labs-and-tests/121',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should display the test name', () => {
    const screen = setup();
    const header = screen.getAllByText(mockChemHem.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the test results', () => {
    const screen = setup();
    const results = screen.getByText(mockChemHem.results[0].name, {
      exact: true,
      selector: 'h3',
    });
    expect(results).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const emptyMessageElement = screen.getByText('June 14, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(emptyMessageElement).to.exist;
  });
});
