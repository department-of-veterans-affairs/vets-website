import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import ChemHemDetails from '../../components/LabsAndTests/ChemHemDetails';
import chemHem from '../fixtures/chemHem.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Chem Hem details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemHem),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <ChemHemDetails
        record={convertLabsAndTestsRecord(chemHem)}
        fullState={initialState}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/ex-MHV-chReport-1',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen);
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(
      initialState.mr.labsAndTests.labsAndTestsDetails.name,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(header).to.exist;
  });

  it('should display the test results', () => {
    const results = screen.getByText(
      initialState.mr.labsAndTests.labsAndTestsDetails.results[0].name,
      {
        exact: true,
        selector: 'h3',
      },
    );
    expect(results).to.exist;
  });

  it('should display the formatted date', () => {
    const dateElement = screen.getByText('January', {
      exact: false,
      selector: 'p',
    });
    expect(dateElement).to.exist;
  });
});
