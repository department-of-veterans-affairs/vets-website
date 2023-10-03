import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import RadiologyDetails from '../../components/LabsAndTests/RadiologyDetails';
import radiology from '../fixtures/radiology.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Radiology details component', () => {
  const radiologyRecord = convertLabsAndTestsRecord(radiology);
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: radiologyRecord,
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RadiologyDetails record={radiologyRecord} fullState={initialState} />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/ex-MHV-imaging-0',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen);
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(
      'RADIOLOGIC EXAMINATION, SPINE, LUMBOSACRAL; 2 OR 3 VIEWS',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const formattedDate = screen.getAllByText('September', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('SPINE LUMBOSACRAL MIN 2 VIEWS', {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
  });
});
