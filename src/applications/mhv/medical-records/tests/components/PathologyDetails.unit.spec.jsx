import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import PathologyDetails from '../../components/LabsAndTests/PathologyDetails';
import pathology from '../fixtures/pathology.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Pathology details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(pathology),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <PathologyDetails
        record={convertLabsAndTestsRecord(pathology)}
        fullState={state}
      />,
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
    const header = screen.getAllByText('LR SURGICAL PATHOLOGY REPORT', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const screen = setup();

    const formattedDate = screen.getAllByText('August', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const screen = setup();
    const results = screen.getByText('Pathologist:SEETHA SURYAPRASAD', {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
  });
});
